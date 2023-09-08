import Store from './store';
const { exec } = require('child_process')

export const play = (path) => {
  const player = Store.get('defaultPlayer') || 'start'
  exec(`${player} "" "${path}"`);
}

export default { play }