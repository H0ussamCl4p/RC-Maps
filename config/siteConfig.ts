// Site Configuration
// Edit this file to customize all text and information displayed on the website

export const siteConfig = {
  // Header section
  header: {
    title: 'Journée à l\'occasion de la marche verte.',
    subtitle: 'Résevation des stands.',
  },

  // Legend sidebar
  legend: {
    standsTitle: 'Stands',
    unavailableTitle: 'Unavailable',
  },

  // Footer section
  footer: {
    text: '© Made by CHOUBIK Houssam, ADE ENSAM Casablanca 2025',
  },

  // Camera and 3D scene settings
  scene: {
    cameraPosition: [6, 6, 8] as [number, number, number],
    cameraFov: 50,
  },

  // General settings
  general: {
    showStandIds: true, // Show stand IDs in the legend
  },
}
