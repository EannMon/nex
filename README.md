# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

Urban Mobility Decision & Operations Platform: LGU Module Documentation
This documentation outlines the specific technical updates and architectural changes made to the Marikina City Mobility Operations Portal, specifically focusing on the LGU / City Mobility (B2G) monetization vertical.



📌 Development Purpose
The primary goal of this module is to provide Local Government Units (LGUs) with derived insights—specifically heatmaps of waiting pain points, congestion analytics, and peak-hour risk zones—to support annual mobility contracts and city planning.


🛠 Feature Updates & Implementation Details
1. Unified Application Shell (App.tsx)
Centralized View Management: Implemented a ViewState manager to handle seamless transitions between the Live Command Center, Commuter Pain Points, Congestion Analytics, Peak Zone Intel, and Operational Logs.

Integrated Command Interface: Added a persistent, glass-morphic floating hamburger menu button with high z-index, ensuring it is accessible across all map layers and mobile views.


Institutional Branding: Updated the sidebar footer with stylized "City of Marikina" and "in partnership with Nexstation" labels to establish the required trust for B2G/B2B operations.

2. Live Command Center (LGUDashboard.tsx)
City Geofencing: Applied strict MARIKINA_BOUNDS and maxBoundsViscosity to restrict the map interface strictly to the city's jurisdiction.

Wait-Time Dependent Heatmaps:

Dynamic Radius: The circle radius is now proportionally tied to the actual minutes spent waiting (standardized to wait * 15).

Severity Color Logic: Implemented getHeatmapColorByWait to categorize commuter "Pain":

Red (>30 mins): Critical status requiring immediate transport dispatch.

Orange (21-30 mins): High volume surge.

Yellow (11-20 mins): Moderate peak flow.

Green (<10 mins): Optimal station throughput.

Interactive Minimizable Legend:

Added a collapsible legend in the bottom-left corner to prevent map occlusion on mobile devices.

Hover Glow Effect: Circles in the legend feature a white drop-shadow glow when hovered.

Contextual Tooltips: Added slide-out descriptions for every color category to explain operational significance (e.g., "Velocity < 10 kph" for Gridlock).

3. Commuter Pain Points Module (CommuterPainPoints.tsx)
Terminal Saturation Index: Replaced generic hazard analysis with visual progress bars representing station/hub capacity.


Passenger Surge Analytics: Integrated PAX (Passenger) counts and trend indicators (Rising/Stable) to identify "Waiting Pain Points" for LGU data monetization.

4. Congestion & Peak Zone Analytics

Network Throughput: Modeled arterial roads (Sumulong Hwy, Marcos Hwy) with velocity tracking (KM/H) to identify gridlock zones.


Temporal Risk Modeling: Created the Peak Hour Risk Zone layer to identify structural bottlenecks and pedestrian surge areas (e.g., Barangka Flyover, Tumana Bridge).

💰 Monetization Vertical Alignment
This technical update directly supports the Wait or Go (Jeepney + Street Bus) monetization strategy:


B2G (City Contracts): Provides the analytical output (Wait-time Heatmaps and Congestion Analytics) necessary for ₱500k – ₱3M annual city contracts.


Ad Engine Triggers: Establishes the WAIT status logic. Heatmaps reaching "Red" (Critical) now serve as the backend trigger for Location-Based Advertising in the passenger-facing app.




Intel Ownership: Maintains the legal requirement that the platform owns derived insights while allowing raw data to remain with operators.