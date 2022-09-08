import { browser } from '$app/env';
import { derived } from "svelte/store";
import theme from './theme'

export type Colors = {
  primary: string,
  secondary: string,
  tertiary: string,
  background: string,
  contrast: string,
  lightContrast: string
  thinContrast: string,
  warning: string,
  warningBackground: string
}

let lighColors: Colors = {
  primary: '#1498D5',
  secondary: '#72C1E6',
  tertiary: '#B8E0F2',
  background: '#EFF2F3',
  contrast: '#143342',
  lightContrast: '#778B95',
  thinContrast: '#DFDFDF',
  warning: '#AD0000',
  warningBackground: '#ffa7a7'
}

let darkColors: Colors = {
  primary: '#197BAA',
  secondary: '#206484', 
  tertiary: '#568ba3',
  background: '#0b1920',
  contrast: '#cccccc',
  lightContrast: '#A3A3A3',
  thinContrast: '#314954',
  warning: '#e04747',
  warningBackground: '#AD0000'
}

const store = derived<typeof theme, Colors>(theme, $theme => $theme == 'light' ? lighColors : darkColors)
export default store

store.subscribe((newColors) => {
  if(browser) {
    document.documentElement.style.setProperty("--global-primary-color", newColors.primary);
    document.documentElement.style.setProperty("--global-secondary-color", newColors.secondary);
    document.documentElement.style.setProperty("--global-tertiary-color", newColors.tertiary);
    document.documentElement.style.setProperty("--global-background-color", newColors.background);
    document.documentElement.style.setProperty("--global-contrast-color", newColors.contrast);
    document.documentElement.style.setProperty("--global-light-contrast-color", newColors.lightContrast);
    document.documentElement.style.setProperty("--global-thin-contrast-color", newColors.thinContrast);
  }
})