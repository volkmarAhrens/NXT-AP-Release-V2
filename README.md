# NXT AP Release

A modern, Fiori-compliant OpenUI5 web application for the release and approval of supplier invoices, ready for deployment on SAP Fiori Launchpad or NXT Web Apps Launchpad.

---

## Project Overview
NXT AP Release streamlines the review and posting of supplier invoices. The app is designed with SAP Fiori UX best practices, dynamic and responsive layouts, and clean, maintainable code. It is fully internationalized and ready for productive OData integration.

---

## Features
- **Fiori Launchpad Tile:**
  - **Title:** NXT AP Release
  - **Subtitle:** Release Supplier Invoices
  - **Info:** Release of Supplier Invoices for Posting
  - **Icon:** sap-icon://activate
  - **Semantic Object:** APRelease
  - **Action:** display
- **Invoice and Line Item Management:**
  - DynamicPage layout for header and actions
  - Two tables: Invoices and Line Items
  - PDF viewer integration for invoice documents
  - Responsive and accessible design
- **Internationalization:**
  - Supported languages: English (EN), German (DE), French (FR), Spanish (ES), Portuguese (PT)
- **Extensible Data Handling:**
  - Uses local JSON mock data for development
  - Ready for OData service integration (no code changes required)
- **Consistent Code Style:**
  - Follows OpenUI5 and SAP naming/layout conventions
  - Modular, well-documented, and maintainable

---

## Setup & Local Development

### Prerequisites
- Node.js (LTS recommended)
- UI5 CLI (`npm install --global @ui5/cli`)

### Installation
```sh
npm install
```

### Run Locally
```sh
ui5 serve -o /index.html
```
The app will be available at [http://localhost:8080/index.html](http://localhost:8080/index.html)

---

## Data Model & Mock Data
- All data is loaded from `/webapp/model/mockdata.json` during development.
- To switch to OData, update the data source in `manifest.json` (no code changes required).
- PDF invoices are stored in `/webapp/resources/` and referenced in the mock data.

---

## Internationalization (i18n) Best Practices & Status

### i18n Binding Solution
- The i18n model is set on the Component **before** `UIComponent.prototype.init.apply(...)` to guarantee global and early availability for all controls.
- All XML view bindings use the standard `{i18n>key}` syntax for maximum OpenUI5 compatibility.
- i18n files are kept in `/webapp/i18n/` and referenced in `manifest.json` as `"i18n/i18n.properties"`.
- For fragments or dynamically created views, set the i18n model explicitly if needed.

### Lessons Learned
- Avoid `{path: 'i18n>key'}` in static XML views, as it may cause empty text in some OpenUI5 versions.
- If i18n bindings do not resolve, check for model inheritance issues, duplicate IDs, and ensure the model is available before any controls are created.

### Current Status
- **All i18n bindings are now fully resolved and displayed correctly in the UI.**
- The application is stable, robust, and ready for further development or deployment.

---

## Latest Commit Summary
- Resolved i18n binding issues by:
  - Setting the i18n model early in the Component.
  - Using standard i18n binding syntax in all XML views.
- Cleaned up test/debug code.
- Documented best practices and lessons learned for future development.
- Project is now fully i18n-compliant and production-ready.

## Language Support
- All UI texts are externalized in `/webapp/i18n/`.
- Supported: English, German, French, Spanish, Portuguese
- To add a new language, create an `i18n_xx.properties` file and add the language code to `manifest.json`.

---

## Deployment
### Fiori Launchpad / NXT Launchpad
- The app is fully FLP-compatible and includes all required descriptors in `manifest.json`.
- Tile, navigation intent, and icons are preconfigured.
- Assign the app to catalogs/groups/roles in your Launchpad admin as needed.

---

## Code Style, Layout, and Naming
- All developments follow the OpenUI5 framework.
- Consistent code style, layout, and naming throughout the project.
- Inline documentation is provided in all controllers and models.

---

## Extensibility
- Modular MVC structure: `/controller`, `/view`, `/model`, `/i18n`, `/resources`
- Easy to add new features, views, or data sources.
- Ready for productive OData integration and future enhancements.

---

## Support & Contributions
For issues or feature requests, please contact the project maintainer or open an issue in your repository system.

---

**NXT AP Release – NXT AP Web-client (Release for Posting)**
