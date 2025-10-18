// mock-data.ts
export const mockAnalysisData = {
  summary: "The company reported strong quarterly earnings, beating analyst expectations on revenue and profit. However, future guidance was cautious due to anticipated supply chain constraints, which concerned investors.",
  overall_sentiment: "Bullish",
  score: 82,
  topics: [
    { topic: "Revenue Growth", sentiment: "Positive" },
    { topic: "Product Innovation", sentiment: "Positive" },
    { topic: "Operating Costs", sentiment: "Neutral" },
    { topic: "Future Guidance", sentiment: "Negative" },
  ],
  quotes: {
    bullish: [
      "Our flagship product line saw a 40% year-over-year increase in sales, a new record.",
      "We are thrilled to announce a strategic partnership that will expand our market reach significantly.",
      "Gross margins have expanded by 200 basis points thanks to operational efficiencies."
    ],
    bearish: [
      "We anticipate persistent headwinds in the supply chain for the next two quarters.",
      "Regulatory scrutiny in international markets remains a key area of uncertainty for us.",
      "While optimistic, we are revising our Q4 revenue forecast down slightly to account for market volatility."
    ]
  }
};

export type AnalysisData = typeof mockAnalysisData;
