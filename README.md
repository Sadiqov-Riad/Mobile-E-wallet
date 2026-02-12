# 💳 Mobile E-Wallet Application

A modern mobile electronic wallet application built with **React Native** and **TypeScript**. This project features a premium dark UI and focuses on delivering a seamless financial management experience for everyday users.

![License](https://img.shields.io/badge/license-Apache-orange.svg)
![React Native](https://img.shields.io/badge/React_Native-v0.72+-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.0-3178C6?logo=typescript&logoColor=white)

---

## ✨ Key Features

* 📊 **Smart Dashboard:** Real-time balance tracking and expense statistics.
* 💳 **Card Management:** Beautifully visualized digital cards with quick switching.
* 💸 **Transaction History:** Detailed list of operations with category icons and status tracking.
* 🌑 **Premium Dark UI:** Sleek, high-contrast interface designed for modern devices.
* ⚡ **Fluid UX:** Smooth transitions and optimized list rendering for a native feel.

---

## 🚀 Tech Stack

* **Framework:** [React Native](https://reactnative.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (Strictly typed for reliability)
* **Navigation:** [React Navigation](https://reactnavigation.org/) (Stack & Bottom Tabs)
* **Icons:** [Lucide React Native](https://lucide.dev/) / FontAwesome
* **Styling:** StyleSheet / Styled-components

---

## 🛠 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Sadiqov-Riad/Mobile-E-wallet.git](https://github.com/Sadiqov-Riad/Mobile-E-wallet.git)
    cd Mobile-E-wallet
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start Metro Bundler:**
    ```bash
    npx react-native start
    ```

4.  **Run on Device/Emulator:**
    * **Android:** `npx react-native run-android`
    * **iOS:** `npx react-native run-ios`

---

## 📂 Project Structure

```text
src/
 ├── components/    # Reusable UI atoms (buttons, inputs, cards)
 ├── screens/       # Main application screens (Home, Wallet, Profile)
 ├── navigation/    # App routing and navigator configurations
 ├── constants/     # Global theme colors, spacing, and styles
 ├── types/         # TypeScript interfaces and type definitions
 └── assets/        # Local images, custom fonts, and static icons
