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

import Devices from "../services/devicesService";
import Colors from "../constants/colors";
import Lang from "../i18n/";

const DevicesScreen = (props) => {
  /**------------------- */

  /**------------------- */

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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
    load();
  }, []);

  /**------------------- */

  const [list, setList] = useState(null);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = (loadOffset = 0) => {
    if (loading) return;
    setLoading(true);

    Devices.getList(auth.token, auth.user, 10 /** Limit */, loadOffset)
      .then((res) => {
        setList(loadOffset == 0 ? res : [...list, ...res]);
        // console.log("-----------------------------", res);

        setOffset(loadOffset);

        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        // console.log("Error:", err);
      });
  };

  /**------------------- */

  const loadMore = () => {
    load(offset + 10);
  };

  /**------------------- */

  const viewDeviceDetail = (item) => {
    props.navigation.navigate("Sensors", { device: item });
  };

  /**------------------- */

  const renderItemComponent = (data) => (
    <ListItem
      bottomDivider
      onPress={() => viewDeviceDetail(data.item)}
      key={data.index}
    >
      <Icon name="devices" color={Colors.Blue} />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "bold" }}>
          {data.item.name ? data.item.name : data.item.id}
        </ListItem.Title>
        <ListItem.Subtitle>
          {data.item.sensors.map((sensor, index) => (
            <Text style={styles.sensorVal} key={index}>
              {sensor.id + "  "}
              {/* : {sensor?.value?.value} */}
            </Text>
          ))}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  /**------------------- */

  if (list === null) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color={Colors.Indicator} />
      </View>
    );
  }

  /**------------------- */

  if (list.length == 0) {
    return (
      <View style={styles.noItems}>
        <Text style={{ alignSelf: "center" }} h4>
          {Lang.t("errors.noDevices") + "\n"}
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
    );
  }

  /**------------------- */

  return (
    <SafeAreaView>
      {loading && <ActivityIndicator color={Colors.Indicator} />}
      <FlatList
        data={list}
        renderItem={(data) => renderItemComponent(data)}
        keyExtractor={(item) => item.id.toString()}
        // ItemSeparatorComponent={ItemSeparator}
        // refreshing={refreshing}
        // onRefresh={handleRefresh}
        // pagingEnabled={true}
        onEndReached={loadMore}
        onEndReachedThreshold={1}
        // Performance settings:
        removeClippedSubviews={true} // Unmount components when outside of window
        initialNumToRender={10} // Reduce initial render amount
        maxToRenderPerBatch={10} // Reduce number in each render batch
        // updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={10} // Reduce the window size
      />
    </SafeAreaView>
  );

  /**------------------- */
};

const styles = StyleSheet.create({
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
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  indicator: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 50,
  },
  noItems: {
    flex: 1,
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

export default DevicesScreen;
