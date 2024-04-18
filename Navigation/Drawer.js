import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import BottomTab from "./BottomTab";
import Profile from "../Screens/Profile";
import StackNavigator from "./StackNavigator";
import DisplayReview from "../Screens/DisplayReview";
import PostingTask from "../Screens/PostingTask";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {/* <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.closeDrawer()}
      /> */}
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator (){
  return (
    <Drawer.Navigator
      initialRouteName="DrawerHome"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="DrawerHome"
        component={StackNavigator}
        options={{ drawerLabel: "HomePage", title: ""}}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{ drawerLabel: "Profile" }}
      />
      <Drawer.Screen
        name="PostingTask"
        component={PostingTask}
        options={{ drawerLabel: "Posting Task" }}
      />
    </Drawer.Navigator>
  );
};


