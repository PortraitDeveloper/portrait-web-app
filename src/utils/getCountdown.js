import getTimeStamp from "@/utils/getTimeStamp";

export default function getCountdown(createdAt, timeOut, timeDiff) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  // Define deadline
  const dateObject = new Date(createdAt);
  dateObject.setMinutes(dateObject.getMinutes() + timeOut);

  // Calculate and setup minutes and second for countdown
  const timeDifference = dateObject - currentTimeStamp;

  const countdown = {
    minutes: Math.floor(timeDifference / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };

  return countdown;
}
