# Manifest for ISO Market Dashboard Project

## Project Overview
The ISO Market Dashboard is a web-based application designed to provide a comprehensive overview of key metrics related to the ISO market. The dashboard includes visualizations for price maps, resource mix, system demand, and a snapshot of today's key statistics. The project leverages modern web technologies and frameworks to create an aesthetically pleasing and functional interface.

## Technologies and Frameworks Used
1. **Bootstrap**
   - **Purpose**: Used for general styling and layout, providing a consistent and responsive design.
   - **Version**: 4.5.2
   - **CDN**: Included via CDN link in the HTML.

2. **Tailwind CSS**
   - **Purpose**: Added for utility-first CSS to enhance the styling and layout flexibility.
   - **Version**: 2.2.19
   - **CDN**: Included via CDN link in the HTML.

3. **Chart.js**
   - **Purpose**: Used to create interactive and responsive charts for visualizing data.
   - **Version**: Latest (included via CDN)
   - **CDN**: Included via CDN link in the HTML.

4. **Animate.css**
   - **Purpose**: Provides animations for enhancing the user experience.
   - **Version**: 4.1.1
   - **CDN**: Included via CDN link in the HTML.

5. **Alpine.js**
   - **Purpose**: A lightweight JavaScript framework for adding interactivity. It pairs well with Tailwind CSS.
   - **Website**: [Alpine.js](https://alpinejs.dev/)

## Project Structure
1. **HTML**: Defines the structure of the webpage, including layout and links to CSS and JavaScript resources.
2. **CSS**: Contains custom styling to enhance the appearance of the dashboard components.
3. **JavaScript**: Handles the creation and updating of charts, as well as user interactions.

## Key Components
1. **Price Map**
   - Displays a placeholder for the price map with buttons to toggle between real-time and day-ahead views.
   - Styled with utility classes from Tailwind CSS.
   - **Enhancements**: Updated buttons with different colors for better contrast and rounded edges for consistency.

2. **Resource Mix**
   - Includes two doughnut charts showing the mix of natural gas, nuclear, renewables, hydro, and other resources.
   - Styled with Tailwind CSS and utilizes Chart.js for chart creation.

3. **System Demand**
   - A line chart displaying forecasted and actual system demand throughout the day.
   - Positioned above the "Today's Snapshot" section.

4. **Today's Snapshot**
   - A compact, grid-based layout displaying key statistics such as available capacity, forecasted peak demand, surplus capacity, and yesterday's peak demand.
   - Uses a combination of Tailwind CSS and custom CSS for styling.
   - **Enhancements**: Improved layout for readability and consistency.

5. **Buttons**
   - "More Real-Time Data" and "Morning Report" buttons are styled with rounded edges and padding for better aesthetics and consistency with the theme.

## Next Steps
1. **Data Integration**
   - Connect the dashboard to a live data source to display real-time data.

2. **User Interactivity**
   - Enhance user interactivity by allowing users to filter data and adjust the time range.

3. **Performance Optimization**
   - Optimize the performance of the dashboard, especially for large datasets.

4. **Testing and Deployment**
   - Conduct thorough testing and deploy the application to a live server.

<img width="1470" alt="image" src="https://github.com/jzhangg917/isodash/assets/94925733/48201a90-d804-49ec-8e66-0bc8d63e0a48">
