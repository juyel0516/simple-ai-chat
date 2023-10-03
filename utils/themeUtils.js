
export function setTheme(theme) {
  if (theme == "light") {
    document.documentElement.style.setProperty('--background-color', 'transparent');
    document.documentElement.style.setProperty('--text-color', '#000000');
    document.documentElement.style.setProperty('--placeholder-color', '#8e8ea0');
    document.documentElement.style.setProperty('--button-color', '#d3d3d3');
    document.documentElement.style.setProperty('--button-hover-color', '#828282');
    document.documentElement.style.setProperty('--button-text-color', '#fff');
    document.documentElement.style.setProperty('--stats-text-color', '#767676');
    document.documentElement.style.setProperty('--info-text-color', '#cccccc');
    document.documentElement.style.setProperty('--border-color', '#ccc');
    document.documentElement.style.setProperty('--border-shadow-color', 'rgba(139, 139, 139, 0.4)');
  }
  
  if (theme == "dark") {
    document.documentElement.style.setProperty('--background-color', '#000000');
    document.documentElement.style.setProperty('--text-color', '#00f700');
    document.documentElement.style.setProperty('--placeholder-color', '#007000');
    document.documentElement.style.setProperty('--button-color', '#001400');
    document.documentElement.style.setProperty('--button-hover-color', '#001f00');
    document.documentElement.style.setProperty('--button-text-color', '#007000');
    document.documentElement.style.setProperty('--stats-text-color', '#007000');
    document.documentElement.style.setProperty('--info-text-color', '#007000');
    document.documentElement.style.setProperty('--border-color', 'rgba(0, 112, 0, 0.3)');
    document.documentElement.style.setProperty('--border-shadow-color', 'rgba(0, 112, 0, 0.5)');
  }
}