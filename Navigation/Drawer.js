import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import BottomTab from "./BottomTab";
import TaskHistory from "../Screens/TaskHistory";
import AcceptedTask from "../Screens/AcceptedTasks";
import PublishedTask from "../Screens/PublishedTasks";
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
        component={BottomTab}
        options={{ drawerLabel: "HomePage", title: "" }}
      />
      <Drawer.Screen
        name="TaskHistory"
        component={TaskHistory}
        options={{ drawerLabel: "Task History" }}
      />
      <Drawer.Screen
        name="PublishedTask"
        component={PublishedTask}
        options={{ drawerLabel: "Published Task" }}
      />
     <Drawer.Screen
        name="AcceptedTask"
        component={AcceptedTask}
        options={{ drawerLabel: "Accepted Task" }}
      />
      <Drawer.Screen
        name="PostingTask"
        component={PostingTask}
        options={{ drawerLabel: "Posting Task" }}
      />
    </Drawer.Navigator>
  );
};


