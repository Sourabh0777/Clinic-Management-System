function findUpcomingDates(workingDays) {
   const currentDate = new Date();
   const todaysDayOfWeek = currentDate.toLocaleString("en-us", {
      weekday: "long",
   });
   const upcoming30Dates = [];
   for (let i = 0; i < workingDays.length; i++) {
      const dayOfWeek = workingDays[i];
      if (todaysDayOfWeek == dayOfWeek) {
         for (let j = 0; j < 30; j++) {
            currentDate.setDate(currentDate.getDate() + 1);
            const upcomingDate = new Date(currentDate);
            upcoming30Dates.push(upcomingDate);
         }
      }
   }
   if (upcoming30Dates.length == 30) {
      return upcoming30Dates;
   }
   const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
   ];
   const currentDay = currentDate.getDay();

   const targetDayIndex = daysOfWeek.indexOf(workingDays[0]);
   let daysUntilTarget = targetDayIndex - currentDay;
   if (daysUntilTarget < 0) {
      daysUntilTarget += 7;
   }
   let nextWorkingDate = new Date(currentDate.getTime());
   nextWorkingDate.setDate(currentDate.getDate() + daysUntilTarget);
   for (let j = 0; j < 30; j++) {
      const upcomingDate = new Date(nextWorkingDate.getTime());
      upcoming30Dates.push(upcomingDate);
      nextWorkingDate.setDate(nextWorkingDate.getDate() + 1);
   }
   return upcoming30Dates;
}

module.exports = { findUpcomingDates };
