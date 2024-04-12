import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, ScrollView } from 'react-native';
import { db } from '../Firebase/FirebaseSetup';
import { doc, getDoc } from 'firebase/firestore';
import { Rating } from 'react-native-ratings';

export default function DisplayReview({ route }) {
  const [review, setReview] = useState(null);
  const { reviewId } = route.params; // Ensure `reviewId` is passed to this component

 
}


