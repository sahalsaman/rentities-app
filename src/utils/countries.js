const indiaCities = {
  tier1: ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"],
  tier2: ["Kochi", "Kozhikode", "Thiruvananthapuram", "Coimbatore", "Jaipur", "Lucknow", "Indore", "Nagpur", "Chandigarh", "Bhopal", "Visakhapatnam", "Mysuru", "Surat", "Vadodara"],
  tier3: ["Kannur", "Thrissur", "Kollam", "Alappuzha", "Kottayam", "Palakkad", "Mangaluru", "Udupi", "Madurai", "Salem", "Tiruchirappalli", "Vijayawada", "Nashik", "Dehradun", "Jodhpur"],
};
const indiaStates = ["Kerala", "Karnataka", "Tamil Nadu", "Telangana", "Maharashtra", "Delhi", "West Bengal", "Gujarat", "Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "Punjab", "Uttarakhand", "Andhra Pradesh"];

export const countries = [
  { name: "India", states: indiaStates, cities: indiaCities },
  { name: "United Arab Emirates", states: ["Abu Dhabi", "Dubai", "Sharjah", "Ajman"], cities: { tier1: ["Dubai", "Abu Dhabi"], tier2: ["Sharjah", "Ajman"], tier3: [] } },
  { name: "United States", states: ["California", "New York", "Texas", "Florida"], cities: { tier1: ["New York", "Los Angeles", "Chicago", "Houston"], tier2: [], tier3: [] } },
  { name: "United Kingdom", states: ["England", "Scotland", "Wales", "Northern Ireland"], cities: { tier1: ["London", "Manchester", "Birmingham"], tier2: [], tier3: [] } },
  { name: "Canada", states: ["Ontario", "British Columbia", "Quebec", "Alberta"], cities: { tier1: ["Toronto", "Vancouver", "Montreal"], tier2: [], tier3: [] } },
  { name: "Australia", states: ["New South Wales", "Victoria", "Queensland", "Western Australia"], cities: { tier1: ["Sydney", "Melbourne", "Brisbane", "Perth"], tier2: [], tier3: [] } },
];

export const tier1Cities = indiaCities.tier1;
export const tier2Cities = indiaCities.tier2;
export const tier3Cities = indiaCities.tier3;
export const topCities = [...tier1Cities, ...tier2Cities, ...tier3Cities];
