# Muslim Daily

**Muslim Daily** is a modern Islamic productivity web and mobile application designed to help Muslims organize their daily spiritual routine with prayer times, Qur’an reading, adhkar, fasting reminders, tasks, and offline-first access.

The project is built to work smoothly both online and offline, with lightweight caching, local storage fallback, and Android WebView support.

---

## Overview

Muslim Daily provides a calm, elegant, and practical experience for daily worship and spiritual tracking. The application focuses on reliability, speed, and accessibility, especially in situations where the internet connection is weak or unavailable.

The platform includes:

- Prayer times
- Qur’an reading section
- Daily adhkar
- Personal tasks
- Fasting reminders
- Offline-first browsing
- Android app support
- Local caching and monthly cache cleanup

---

## Key Features

### Prayer Times

The application displays daily prayer times and keeps them available even when the user goes offline.

If live prayer data cannot be loaded because of a network issue, location permission issue, or API failure, the app falls back to the latest saved prayer times stored locally.

This prevents the prayer times card from disappearing in both online and offline modes.

### Offline-First Experience

Muslim Daily is designed to continue working even without an internet connection.

The website uses:

- Service Worker caching
- LocalStorage backup
- Static asset caching
- Offline fallback pages
- Monthly cache cleanup

This allows users to open the website again without internet and still access the core experience.

### LocalStorage Backup

Important app data is saved locally in the browser using `localStorage`.

This includes cached content and fallback data that can be restored when the app is offline or when the server is temporarily unavailable.

### Monthly Cache Cleanup

To keep the app lightweight and avoid unnecessary storage usage, cached data is cleaned periodically.

The cache strategy is designed to preserve useful offline data while removing outdated pages and temporary files on a monthly basis.

### Fasting Reminders

The application includes fasting reminders for important voluntary fasting days:

- Monday fasting reminder
- Thursday fasting reminder
- White Days reminder: 13th, 14th, and 15th of the Hijri month

These reminders are designed to help users stay consistent with Sunnah fasting.

### Android App Support

The project includes an Android WebView application version.

The Android app supports:

- Offline local site loading
- WebView performance improvements
- Native notification support
- Faster timeout handling
- Offline fallback behavior
- Embedded offline assets

The Android version is useful for users who want an app-like experience while still relying on the same web-based system.

---

## Notifications Summary

The project supports several notification-related features.

### Supported Notifications

- Prayer notifications
- Adhkar reminders
- Qur’an daily reading reminders
- Monday fasting reminder
- Thursday fasting reminder
- White Days fasting reminders

### Task Notifications

The task system supports task data and notification-related fields, but full task notification scheduling still requires additional integration.

To fully support task reminders, the app should schedule a native notification when a new task is created with a reminder time.

Recommended implementation:

- Add a JavaScript call when a task is created
- Connect it to the Android bridge
- Schedule the reminder using Android `AlarmManager`
- Trigger a notification at the selected task time

---

## Project Structure

Typical web project structure:

```text
public_html/
  index.html
  sw.js
  .htaccess
  manifest.webmanifest
  css/
  js/
  api/
  img/
  data/
  core/
  sql/
