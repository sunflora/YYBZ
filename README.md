# BaZi (八字) Calculator

A comprehensive Chinese Four Pillars (BaZi/八字) astrology calculator with precise astronomical calculations covering 76 years (1950-2025).

## 🌟 Features

- **Precise Calculations**: Uses exact solar term times for accurate pillar calculations
- **Complete Dataset**: 76-year coverage (1950-2025) with astronomical precision
- **Four Pillars**: Year (年柱), Month (月柱), Day (日柱), and Hour (时柱) calculations
- **Traditional Methods**: Five Tigers (五虎遁) and Five Rats (五鼠遁) formulas
- **Testing Framework**: Validation system with external reference data
- **Data Management**: Solar terms and reference data management tools

## 🚀 Quick Start

1. **Use the Calculator**
   - Open `index.html` in your web browser
   - Enter birth date and time
   - Click "分析八字 (Analyze Eight Words)"

2. **Import Complete Dataset** (Recommended for accuracy)
   - Open `quick-import-all-years.html`
   - Click "導入全部數據 (Import All Data)"
   - This loads precise solar terms for 1950-2025

## 📁 Files

### Core Application
- `index.html` - Main BaZi calculator interface
- `script.js` - Core calculation logic with dataset loading
- `style.css` - Application styling

### Testing & Validation
- `test-with-references-file.html` - Testing framework with file-based references
- `reference-manager.html` - LocalStorage-based reference data management
- `reference-manager-file.html` - File-based reference data management
- `data/bazi-references-2025-06-09.json` - Sample reference data

### Data Management
- `solar-terms-manager.html` - Solar terms data management interface
- `quick-import-all-years.html` - Complete 76-year dataset import tool
- `complete-solar-terms-1950-2024.js` - Complete solar terms data (1950-2024)

## 🔧 Technical Details

### Solar Terms Implementation
- Covers 12 major solar terms with exact astronomical times
- Handles edge cases like early/late 子时 (zi hour) correctly
- Uses precise Hong Kong time (UTC+8) calculations

### Calculation Methods
- **Year Pillar**: 立春 (Lichun) timing with proper 60-year cycle
- **Month Pillar**: 12 major solar terms with Five Tigers formula
- **Day Pillar**: Reference-based calculation from verified dates
- **Hour Pillar**: Five Rats method with zi hour edge case handling

## 📊 Testing

1. Add test cases using `reference-manager.html` or `reference-manager-file.html`
2. Run validation tests with `test-with-references-file.html`
3. Compare results with external calculators for accuracy verification

## 🎯 Accuracy

This calculator implements traditional Chinese astrology calculations with:
- Precise astronomical solar term timings
- Proper handling of calendar edge cases
- Validation against multiple reference sources
- 76-year historical coverage for comprehensive testing

## 📄 License

This project is for educational and personal use in studying Chinese astrology and traditional calendar systems.