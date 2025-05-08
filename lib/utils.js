// Utility functions that don't rely on @ant-design/colors

// Function to merge classNames
export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

// Function to format date
export function formatDate(date) {
  return new Date(date).toLocaleDateString()
}
