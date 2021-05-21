import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button, Text, ListItem, Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import TimeAgo from "react-native-timeago";

import Devices from "../services/devicesService";
import Colors from "../constants/colors";
import Lang from "../i18n/";

import Ontologies from "../constants/ontologies.json";
import SvgIcons from "../assets/svgIcons";

const SensorsScreen = (props) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const device = props.route.params.device;

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

    // console.log("Route name: ", props.navigation.dangerouslyGetState());
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

    return Devices.getSensorsList(auth.token, device.id)
      .then((res) => {
        setList(res);
        setLoading(false);
        // console.log("-----------------------------", res);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        // console.log("Error:", err);
      });
  };

  /**------------------- */

  const viewSensorChart = (sensor) => {
    // SensorChartScreen
    props.navigation.navigate("SensorChart", { device, sensor });
  };

  /**------------------- */

  const renderItemComponent = (data) => {
    const kind = data.item?.sensor_kind || "";
    const unit = data.item?.unit || "";

    const icon = Ontologies.sensingDevices[kind]?.icon;

    const kindLabel = Ontologies.sensingDevices[kind]?.label || kind;
    const unitLabel = Ontologies.units[unit]?.label || unit;

    // console.log("---> DataItem: ", data.item);

    return (
      <ListItem
        bottomDivider
        onPress={() => viewSensorChart(data.item)}
        key={data.index}
      >
        <SvgIcons name={icon} size={50} />
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: "bold" }}>
            {data.item.name ? data.item.name : data.item.id}
          </ListItem.Title>
          <ListItem.Subtitle>{kindLabel}</ListItem.Subtitle>
          {data.item?.value && (
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold", color: Colors.Blue }}>
                {data.item?.value?.value} {unitLabel}
              </Text>
              <Text
                style={{
                  // fontStyle: "italic",
                  fontSize: 12,
                  color: Colors.LightGray,
                }}
              >
                {" ("}
                {data.item?.value?.date_received && (
                  <TimeAgo
                    style={{ fontWeight: "bold" }}
                    time={data.item?.value?.date_received}
                  />
                )}
                )
              </Text>
            </View>
          )}
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  };

  /**------------------- */

  return (
    <SafeAreaView>
      <View style={styles.mainView}>
        <Text h4>{device?.name ? device?.name : device?.id}</Text>
        <Text style={{ color: Colors.Blue }}>
          {Lang.t("labels.lastSeen")}:{" "}
          {device?.date_modified ? (
            <TimeAgo
              style={{ fontWeight: "bold" }}
              time={device?.date_modified}
            />
          ) : (
            Lang.t("labels.never")
          )}
        </Text>
      </View>

      {loading && <ActivityIndicator color={Colors.Indicator} />}
      {list?.length == 0 && (
        <View style={styles.noItems}>
          <Text style={{ alignSelf: "center" }} h4>
            {Lang.t("errors.noSensors") + "\n"}
          </Text>
          <Button
            buttonStyle={styles.button}
            raised
            textStyle={styles.buttonTxt}
            title={Lang.t("labels.reload")}
            icon={{ name: "refresh", size: 20, color: Colors.LightGray }}
            onPress={() => {
              setList(null);
              load();
            }}
            loading={loading}
          />
        </View>
      )}

      <FlatList
        data={list}
        renderItem={(data) => renderItemComponent(data)}
        keyExtractor={(item) => item.id.toString()}
        // ItemSeparatorComponent={ItemSeparator}
        // refreshing={refreshing}
        // onRefresh={handleRefresh}
        // pagingEnabled={true}
        // onEndReached={loadMore}
        // onEndReachedThreshold={1}
        // Performance settings:
        // removeClippedSubviews={true} // Unmount components when outside of window
        // initialNumToRender={10} // Reduce initial render amount
        // maxToRenderPerBatch={10} // Reduce number in each render batch
        // updateCellsBatchingPeriod={100} // Increase time between renders
        // windowSize={10} // Reduce the window size
      />
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
  text: {
    color: "#008",
    fontWeight: "bold",
    fontSize: 24,
  },
});

export default SensorsScreen;
