import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import RNFS from "react-native-fs";
import Papa from "papaparse";
import { LineChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";

const App = () => {
  const [data, setData] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [selectedParam, setSelectedParam] = useState("");
  const [chartData, setChartData] = useState({ means: [], sites: [] });
  const [aiResult, setAiResult] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  useEffect(() => {
    const loadCSV = async () => {
      try {
        // Read the CSV file from the app's assets directory
        const csvString = await RNFS.readFileAssets('sample.csv', 'utf8');

        // Parse the CSV string
        const parsed = Papa.parse(csvString, { header: true, skipEmptyLines: true });

        setData(parsed.data);

        // --- THIS IS THE FIX ---
        // Create an array of unique parameter names
        // Using [...new Set()] ensures you get an array, not an object.
        const uniqueParams = [
          ...new Set(parsed.data?.map((d) => d["Parameter Name"]).filter(Boolean)),
        ];

        setParameters(uniqueParams);
        console.log("Parsed rows:", parsed.data.length);
        console.log("Found parameters:", uniqueParams);

      } catch (error) {
        console.log("CSV read error:", error);
        console.error(error);
      }
    };

    loadCSV();
  }, []);

  useEffect(() => {
    if (!selectedParam || !data.length) return;
    const filtered = data.filter((d) => d["Parameter Name"] === selectedParam);
    const means = filtered?.map((d) => parseFloat(d["Arithmetic Mean"] || 0));
    const sites = filtered?.map((d) => d["Local Site Name"]);
    setChartData({ means, sites });
    const avg = means.reduce((a, b) => a + b, 0) / means.length;
    if (avg > 100) setAiResult("Air Quality: Unhealthy 😷");
    else if (avg > 50) setAiResult("Air Quality: Moderate 😐");
    else setAiResult("Air Quality: Good 😊");
  }, [selectedParam, data]);

  const handleChat = () => {
    let reply = "Sorry, I didn’t understand that.";
    if (!chartData.means.length) reply = "Please select a pollutant first.";
    else if (chatInput.toLowerCase().includes("highest"))
      reply = `Highest ${selectedParam}: ${Math.max(...chartData.means).toFixed(2)}`;
    else if (chatInput.toLowerCase().includes("lowest"))
      reply = `Lowest ${selectedParam}: ${Math.min(...chartData.means).toFixed(2)}`;
    else if (chatInput.toLowerCase().includes("average")) {
      const avg = chartData.means.reduce((a, b) => a + b, 0) / chartData.means.length;
      reply = `Average ${selectedParam}: ${avg.toFixed(2)}`;
    } else if (chatInput.toLowerCase().includes("quality")) reply = aiResult;
    setChatResponse(reply);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🌍 AirSense Dashboard</Text>

      <Text style={styles.label}>Select Pollutant:</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedParam}
          onValueChange={(v) => setSelectedParam(v)}
        >
          <Picker.Item label="-- Choose Parameter --" value="" />
          {/* Optional chaining is good for safety, but the main fix was the array initialization */}
          {parameters?.map((p, i) => (
            <Picker.Item key={i} label={p} value={p} />
          ))}
        </Picker>
      </View>

      {chartData.means.length > 0 && (
        <LineChart
          data={{
            labels: chartData.sites.slice(0, 5),
            datasets: [{ data: chartData.means.slice(0, 5) }],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#1E2923",
            backgroundGradientTo: "#08130D",
            color: (opacity = 1) => `rgba(26,255,146,${opacity})`,
          }}
          style={styles.chart}
        />
      )}

      <Text style={styles.aiResult}>{aiResult}</Text>

      <View style={styles.chatContainer}>
        <Text style={styles.chatTitle}>💬 Chatbot</Text>
        <TextInput
          style={styles.input}
          placeholder="Ask (e.g., highest ozone)"
          value={chatInput}
          onChangeText={setChatInput}
        />
        <Button title="Ask" onPress={handleChat} />
        <Text style={styles.response}>{chatResponse}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center" },
  label: { marginTop: 20, fontSize: 16 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginVertical: 10,
  },
  chart: { marginVertical: 10, borderRadius: 16 },
  aiResult: { fontSize: 18, marginTop: 10, textAlign: "center" },
  chatContainer: { marginTop: 30 },
  chatTitle: { fontSize: 20, fontWeight: "600" },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 8,
    marginVertical: 10,
    borderRadius: 8,
  },
  response: { marginTop: 10, fontSize: 16 },
});

export default App;
