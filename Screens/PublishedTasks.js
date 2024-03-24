import React, { Component } from 'react'
import { Text, View } from 'react-native'
import {db} from "../Firebase/FirebaseSetup"

export default function PublishedTasks() {
    console.log(db)
    return (
      <View>
        <Text> Published Tasks </Text>
      </View>
    )
  
}