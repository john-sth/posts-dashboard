<script setup>
//=========================================================================================================
// Module Name: postStore
//=========================================================================================================
// Author: Johann Spenrath
//=========================================================================================================
// Description:
//     <Brief overview of what the module does.>
//     <Key functionalities, algorithms, or data processing performed.>
//
// Usage:
//     <Short example of how to use the module.>
//
// Dependencies:
//     - <dependency1>
//     - <dependency2>
//
//=========================================================================================================
// Notes:
//
//=========================================================================================================
</script>

<template>
  <div class="app-container">
    <header class="app-header">C4Rocks Dashboard</header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
/* use default color*/
:root {
  --default-color: ;
}
/* Main Content */
main {
  flex: 1;
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
  background-color: inherit;
}
/* app layout */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
  background-color: white;
  color: #333;
}

/* Header */
.app-header {
  background-color: #4fb9b5;
  color: white;
  padding: 1.5rem;
  font-size: 2rem;
  font-weight: bold;
  text-align: left;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Footer */
.app-footer {
  background-color: #4fb9b5;
  color: white;
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
  margin-top: auto;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05);
}

/* Post Cards */
.post {
  background: white;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.post:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Post Meta */
.post-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
}

.post-meta .tag {
  background-color: #4fb9b5;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
  font-size: 0.75rem;
}

/* Responsive tweaks */
@media (max-width: 600px) {
  .post-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
