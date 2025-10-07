import React, { useEffect } from 'react'
import { useStopwatch } from 'react-timer-hook';
import { Badge} from "reactstrap";
const Timeworked = ({ data, startTimer }) => {
    const stopwatchOffset = new Date();
    stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + data);
    const {
        seconds,
        minutes,
        hours,
        days,
        pause,
        start,
    } = useStopwatch({ autoStart: true, offsetTimestamp: stopwatchOffset });
    useEffect(() => {

        if (startTimer) {
            start()
        } else {
            pause()
        }
    }, [startTimer])
    return (
        <span>
            <Badge style={{fontSize:'16px'}} color={days<7?'success':'danger'}>
                <span>{days}d</span>:<span>{hours}h</span>:<span>{minutes}m</span>:<span>{seconds}s</span>
            </Badge>
        </span>
    );
}

export default Timeworked