import { initNav } from './NavComponent.js';
import { navData } from './nav-data.js';

initNav({
  containerSelector: '.site-nav', 
  data: navData
});