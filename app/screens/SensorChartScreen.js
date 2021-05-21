import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
// import {
//   LineChart,
//   // BarChart,
//   // PieChart,
//   // ProgressChart,
//   // ContributionGraph,
//   // StackedBarChart
// } from "react-native-chart-kit";
// // https://www.npmjs.com/package/react-native-chart-kit

import PureChart from "react-native-pure-chart";

import { Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import TimeAgo from "react-native-timeago";
import formatDistance from "date-fns/formatDistance";

import Devices from "../services/devicesService";
import Colors from "../constants/colors";
import Lang from "../i18n/";

import Ontologies from "../constants/ontologies.json";
import SvgIcons from "../assets/svgIcons";

const SensorChartScreen = (props) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  /**------------------- */

  const device = props.route.params.device;
  const sensor = props.route.params.sensor;

  const kind = sensor?.sensor_kind || "";
  const unit = sensor?.unit || "";

  const icon = Ontologies.sensingDevices[kind]?.icon;

  const kindLabel = Ontologies.sensingDevices[kind]?.label || kind;
  const unitLabel = Ontologies.units[unit]?.label || unit;

  // console.log("\n--------------------------\n");
  // // console.log("device: ", device);
  // console.log("sensor: ", sensor);

  /**------------------- */

  if (!auth.user) {
    return (
      <View>
        <Text>Login required!</Text>
      </View>
    );
  }

  /**------------------- */

  useEffect(() => {
    var timeoutActive = null;
    const loop = () => {
      load().then(() => {
        timeoutActive = setTimeout(loop, 30 * 1000); // Check for new updates
      });
    };

    loop();

    return () => {
      // Clean the mess on unmount
      clearTimeout(timeoutActive);
      timeoutActive = null;
    };
  }, []);

  /**------------------- */

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    if (loading) return;
    setLoading(true);

    return Devices.getSensorValue(auth.token, device.id, sensor.id, 100, 0)
      .then((res) => {
        setList(res);
        setLoading(false);
        // console.log("-----------------------------", res);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.log("Error:", err);
      });
  };

  /**------------------- */

  const chartData = !list
    ? []
    : list.map((item, _idx) => {
        const currentDate = new Date();
        const dateTo = new Date(item.date_received);
        return {
          y: Number(item.value),
          x: formatDistance(dateTo, currentDate, {
            addSuffix: false,
          })
            .replace("about", "~")
            .replace("less than", "<")
            // .replace("over", ">")
            .replace("hour", "hr")
            .replace("year", "yr")
            .replace("minute", "min"),
          // date: dateTo,
        };
        return item.date_received;
      });

  /**------------------- */

  let latest = {
    value: sensor?.value?.value,
    date: sensor?.value?.date_received,
  };
  if (list && list.length) {
    latest = {
      value: list[list.length - 1]?.value,
      date: list[list.length - 1]?.date_received,
    };
  }

  /**------------------- */

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollView}>
        <View style={styles.mainView}>
          <Text h3>{device?.name ? device?.name : device?.id}</Text>
          <Text h4>{sensor?.name ? sensor?.name : sensor?.id}</Text>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <SvgIcons name={icon} size={50} />
            <View style={{ marginLeft: 10 }}>
              <Text h5>{kindLabel}</Text>
              {latest?.value && (
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <Text style={{ fontWeight: "bold", color: Colors.Blue }}>
                    {latest?.value} {unitLabel}
                  </Text>
                  <Text
                    style={{
                      // fontStyle: "italic",
                      fontSize: 12,
                      color: Colors.LightGray,
                    }}
                  >
                    {" ("}
                    {latest?.date && (
                      <TimeAgo
                        style={{ fontWeight: "bold" }}
                        time={latest?.date}
                      />
                    )}
                    )
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {list?.length == 0 && (
          <View style={styles.noItems}>
            <Text style={{ alignSelf: "center" }} h4>
              {Lang.t("errors.noValues") + "\n"}
            </Text>
          </View>
        )}

        {chartData.length > 0 && (
          <View style={{ marginHorizontal: 5 }}>
            <PureChart
              data={[
                { data: chartData, seriesName: "frst", color: Colors.DarkBlue },
              ]}
              type="line"
              backgroundColor={"#DDD"}
              labelColor={Colors.VeryDarkGray}
              xAxisColor={"#EEE"}
              yAxisColor={"#EEE"}
              xAxisGridLineColor={"#EEE"}
              yAxisGridLineColor={"#EEE"}
              height={300}
              borderRadius={10}
            />
          </View>
        )}
        {loading && <ActivityIndicator color={Colors.Indicator} />}

        {/* <LineChart
          onDataPointClick={({ value, dataset, getColor }) => {
            console.log("Click: ", value);
            // getColor(0.5);
          }}
          data={{
            labels: chartLabels,
            datasets: [
              {
                data: chartData,
              },
            ],
          }}
          width={Dimensions.get("window").width + chartData.length * 10} // from react-native
          height={400}
          yAxisLabel=""
          // yAxisSuffix={" " + unitLabel}
          yAxisInterval={1} // optional, defaults to 1
          verticalLabelRotation={70}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 10,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 8,
          }}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );

  /**------------------- */
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  noItems: {
    // flex: 1,
    // justifyContent: "center",
    // alignContent: "center",
    // flexDirection: "column",
    // justifyContent: "space-around",
    padding: 50,
    marginTop: 50,
  },
  button: {
    backgroundColor: Colors.VeryDarkGray,
    alignSelf: "center",
    borderRadius: 10,
    width: "100%",
  },
  buttonTxt: {
    color: Colors.LightGray,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  itemList: {
    height: 300,
    margin: 10,
    backgroundColor: "#FFF",
    borderRadius: 6,
  },
  image: {
    height: "100%",
    borderRadius: 4,
  },
  indicator: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 50,
  },
  mainView: {
    padding: 10,
  },
  sensorVal: {
    color: "#008",
    padding: 15,
    borderLeftWidth: 2,
  },
  scrollView: {
    // backgroundColor: "pink",
    // marginHorizontal: 20,
  },
  text: {
    color: "#008",
    fontWeight: "bold",
    fontSize: 24,
  },
});

export default SensorChartScreen;
