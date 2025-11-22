// src/components/QuoteSection.jsx
import React from 'react';
import { View } from 'react-native';
import { Text, useTheme, Card } from 'react-native-paper';
import { Quote } from 'lucide-react-native';

const QuoteSection = () => {
  const theme = useTheme();
  
  const fitnessQuotes = [
    {
      quote: "The only bad workout is the one that didn't happen.",
      author: "Unknown"
    },
    {
      quote: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
      author: "Rikki Rogers"
    },
    {
      quote: "Success isn't always about greatness. It's about consistency. Consistent hard work gains success. Greatness will come.",
      author: "Dwayne Johnson"
    },
    {
      quote: "The body achieves what the mind believes.",
      author: "Unknown"
    },
    {
      quote: "Don't wish for it, work for it.",
      author: "Unknown"
    }
  ];

  // Select a random quote
  const randomQuote = fitnessQuotes[Math.floor(Math.random() * fitnessQuotes.length)];

  return (
    <Card style={{ margin: 8, backgroundColor: theme.colors.surfaceVariant }}>
      <Card.Content style={{ paddingVertical: 20, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <Quote size={24} color={theme.colors.primary} style={{ marginRight: 12, marginTop: 4 }} />
          <View style={{ flex: 1 }}>
            <Text 
              variant="bodyLarge" 
              style={{ 
                color: theme.colors.onSurfaceVariant, 
                fontStyle: 'italic',
                lineHeight: 24,
                marginBottom: 8
              }}
            >
              "{randomQuote.quote}"
            </Text>
            <Text 
              variant="bodyMedium" 
              style={{ 
                color: theme.colors.onSurfaceVariant,
                opacity: 0.8,
                textAlign: 'right'
              }}
            >
              — {randomQuote.author}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default QuoteSection;