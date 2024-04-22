import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, ActivityIndicator, StyleSheet, Button, Image } from 'react-native';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseSetup';  


const DisplayReviews = ({ route, navigation }) => {
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : reviews.length > 0 ? (
        reviews.map((review) => (
          <View key={review.id} style={styles.reviewContainer}>
            {review.imageUrl && <Image source={{ uri: review.imageUrl }} style={styles.image} />}
            <Text style={styles.reviewText}>Rating: {review.rating}</Text>
            <Text style={styles.reviewText}>Comment: {review.text}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noReviewsText}>No reviews found.</Text>
      )}
    </ScrollView>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff', 
  },
  reviewContainer: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f8f9fa', 
    borderRadius: 8,
    elevation: 2, 
    borderColor: '#dedede', 
    borderWidth: 1,
  },
  reviewText: {
    fontSize: 16,
    color: '#333333', 
    marginBottom: 5, 
  },
  image: {
    width: '100%', 
    height: 200, 
    borderRadius: 5, 
    marginBottom: 10, 
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000', 
    marginBottom: 10, 
  },
  noReviewsText: {
    fontSize: 18,
    color: '#606060', 
    textAlign: 'center', 
    marginTop: 20, 
  }
});


export default DisplayReviews;