// src/components/CategoryCard.jsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

const CategoryCard = ({ title, description, imageUrl, icon, onPress }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity 
      style={{ flex: 1, margin: 4 }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Card style={{ flex: 1 }}>
        <Card.Cover 
          source={{ uri: imageUrl }} 
          style={{ height: 120 }}
        />
        <Card.Content style={{ paddingTop: 12, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            {icon}
            <Text 
              variant="titleMedium" 
              style={{ 
                fontWeight: 'bold', 
                marginLeft: 8, 
                color: theme.colors.onSurface,
                flex: 1 
              }}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
          <Text 
            variant="bodyMedium" 
            style={{ 
              color: theme.colors.onSurfaceVariant,
              lineHeight: 20 
            }}
            numberOfLines={2}
          >
            {description}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

export default CategoryCard;