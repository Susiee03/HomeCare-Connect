import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, ScrollView } from 'react-native';
import { db } from '../Firebase/FirebaseSetup';
import { doc, getDoc } from 'firebase/firestore';
import { Rating } from 'react-native-ratings';

export default function DisplayReview({ route }) {
  const [review, setReview] = useState(null);
  const { reviewId } = route.params; // Ensure `reviewId` is passed to this component

  useEffect(() => {
    const fetchReview = async () => {
        console.log("Review ID:", reviewId);
        const reviewRef = doc(db, "Review", reviewId);
        try {
            const docSnap = await getDoc(reviewRef);

            if (docSnap.exists()) {
                setReview(docSnap.data());
            } else {
                console.log('No such review!');
            }
        } catch (error) {
            console.error("Failed to fetch review:", error);
            // Optionally, you can update the state to show an error message to the user
        }
    };

    fetchReview();
}, [reviewId]);



  return (
    <ScrollView style={styles.container}>
        <Text style={styles.title}>Review Details</Text>
        {review ? (
            <>
                <Text style={styles.reviewText}>{review.text}</Text>
                <View style={styles.rating}>
                    <Rating
                        type='star'
                        ratingCount={5}
                        readonly={true}
                        startingValue={review.rating}
                        imageSize={30}
                    />
                </View>
            </>
        ) : (
            <Text>Loading review...</Text> // Show a loading message or a spinner here
        )}
    </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  reviewText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  rating: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  }
});

