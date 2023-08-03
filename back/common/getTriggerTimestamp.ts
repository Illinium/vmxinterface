const getTimestamp = (): string => {
    // timestamp + 10 days in seconds - 864000
   const milesoconds =  Math.floor(new Date().getTime()/1000.0) + 864000;
   return milesoconds.toString(16)
}

export { getTimestamp };