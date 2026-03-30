AirSense Dashboard 🌍
HARWARE SECTION ():
  🌡️ ESP32 BME280 Sensor Interface

This project demonstrates how to interface a BME280 environmental sensor with an ESP32 using the I2C protocol. It reads temperature, humidity, and pressure values and provides them in a simple format.

📌 Features
📡 I2C communication with BME280 sensor
🌡️ Temperature measurement
💧 Humidity measurement
🌪️ Pressure measurement
⚡ Lightweight and simple implementation using ESP-IDF
🧩 Modular code structure (.c and .h files)
🛠️ Hardware Requirements
ESP32 Development Board
BME280 Sensor Module
Jumper Wires
🔌 Pin Connections
BME280	ESP32
VCC	3.3V
GND	GND
SDA	GPIO 21
SCL	GPIO 22

⚠️ Note: The I2C address is set to 0x76 (can be 0x77 depending on your module).

📂 Project Structure
├── sensorreading.c   # BME280 driver implementation
├── sensorreading.h   # Function declarations
├── config.c          # ESP-IDF setup instructions
⚙️ Setup Instructions
1️⃣ Install ESP-IDF

Follow the official ESP-IDF installation guide.

2️⃣ Configure Project

Run the following commands in terminal:

idf.py set-target esp32
idf.py menuconfig
3️⃣ Build and Flash
idf.py build
idf.py flash
idf.py monitor
🚀 How It Works
Initialization
Configures I2C communication
Checks sensor ID (0x60)
Performs soft reset
Sets oversampling for temperature, humidity, and pressure
Data Reading
Reads raw sensor data from registers
Converts raw values into:
Temperature (°C)
Pressure (hPa)
Humidity (%)
🧪 Example Function Usage
float temp, hum, pres;

if (bme280_init() == ESP_OK) {
    bme280_read_raw(&temp, &hum, &pres);
}

SOFTWARE SECTION 
AirSense Dashboard is a simple yet powerful React Native mobile application designed for Android to visualize and query air quality data. The app reads pollution data from a local CSV file, presents it in an interactive line chart, and allows users to ask basic questions about the data through a simple chatbot.

📖 About The App
This application serves as a dashboard for environmental data analysis. It empowers users to select a specific air pollutant (like Ozone, Carbon Monoxide, etc.) from a dropdown menu. Upon selection, the app dynamically generates a line chart showing the pollutant's mean levels across different monitoring sites. It also provides a quick, color-coded assessment of the air quality and features a chatbot for quick data inquiries.

✨ Key Features
Local Data Processing: Reads and parses a sample.csv file directly from the device assets using react-native-fs and papaparse.

Dynamic Data Visualization: Renders an interactive line chart using react-native-chart-kit to display the "Arithmetic Mean" of the selected pollutant for the first 5 available sites.

Simple AI Analysis: Provides an immediate air quality status (Good 😊, Moderate 😐, Unhealthy 😷) based on the average pollutant level.

Conversational Chatbot: A simple, rule-based chatbot that can answer questions about the highest, lowest, and average values for the selected pollutant.

🛠️ Tech Stack & Dependencies
Core: React Native

File System: react-native-fs (to read the local CSV file)

CSV Parsing: papaparse (to convert CSV text into a JSON object)

Charts: react-native-chart-kit (for rendering the line chart)

UI Components: @react-native-picker/picker (for the pollutant selection dropdown)

Chatbot Logic (handleChat function):

This function is called when the "Ask" button is pressed.

It checks the user's chatInput for keywords like "highest," "lowest," "average," or "quality."

Based on the keyword, it performs the corresponding calculation (Math.max, Math.min, etc.) on the current chartData or retrieves the aiResult and updates the chatResponse state to display the answer.

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```Bash
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```Bash
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```Bash
bundle install
```

Then, and every time you update your native dependencies, run:

```Bash
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```Bash
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
