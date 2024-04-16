import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseSetup';  // Adjust the import path as necessary

const DisplayReviews = ({ route }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { taskId } = route.params;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Creating a reference to all reviews for a specific task
        const reviewsRef = collection(db, 'taskHistory', taskId, 'reviews');
        const reviewsQuery = query(reviewsRef);
        const querySnapshot = await getDocs(reviewsQuery);

        const fetchedReviews = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [taskId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <View key={review.id} style={styles.reviewContainer}>
            <Text style={styles.reviewText}>Rating: {review.rating}</Text>
            <Text style={styles.reviewText}>Comment: {review.text}</Text>
          </View>
        ))
      ) : (
        <Text>No reviews found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  reviewText: {
    fontSize: 16,
  },
});

export default DisplayReviews;
