<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap");

:root {
  --primary-blue: #236d90;
  --primary-red: #ee2d24;
  --primary-yellow: #ffcc00;
  --bg-light: #f8fafc;
  --text-dark: #1e293b;
  --text-muted: #64748b;
  --accent-blue: #2563eb;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Plus Jakarta Sans", sans-serif;
  color: var(--text-dark);
  background-color: white;
  -webkit-font-smoothing: antialiased;
}

/* Global utility classes */
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
