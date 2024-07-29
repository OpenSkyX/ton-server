import Transaction from "../../Model/transaction.model";

// 函数：根据价格数据生成 K 线图数据
export function generateKLineData(priceData, interval) {
    if (!priceData || priceData.length === 0) {
        return [];
    }
    const kLineData = [];
    let startTime = priceData[0].timestamp;
    let lastClose = priceData[0].price;

    while (startTime <= priceData[priceData.length - 1].timestamp) {
        const endTime = startTime + interval;
        const periodData = priceData.filter(
            (data) => data.timestamp >= startTime && data.timestamp < endTime
        );

        if (periodData.length > 0) {
            const open = periodData[0].price;
            const close = periodData[periodData.length - 1].price;
            const high = Math.max(...periodData.map((data) => data.price));
            const low = Math.min(...periodData.map((data) => data.price));

            kLineData.push({
                timestamp: convertTimestamp(startTime),
                open,
                close,
                high,
                low,
            });
            lastClose = close;
        } else {
            kLineData.push({
                timestamp: convertTimestamp(startTime),
                open: lastClose,
                close: lastClose,
                high: lastClose,
                low: lastClose,
            });
        }
        startTime = endTime;
    }
    return kLineData;
}

export function convertTimestamp(timestamp) {
    const numericTimestamp = Number(timestamp);
    return Math.floor(numericTimestamp / 1000);
}

export function convertToOHLC(rawData: Transaction[], interval: number) {
    if (!rawData || rawData.length === 0) {
        return [];
    }
    let ohlcData = [];
    let currentInterval = null;
    let lastClose = null;
    // rawData.sort((a, b) => a.timestamp - b.timestamp);
    
    for (let i = 0; i < rawData.length; i++) {
        let data = rawData[i]; // 计算当前数据点所在的时间段
        let timestamp = new Date(data.timestamp * 1000);
        let minutes = timestamp.getMinutes();
        let remainder = minutes % interval;
        timestamp.setMinutes(minutes - remainder);
        timestamp.setSeconds(0);
        timestamp.setMilliseconds(0); // 如果当前数据点不在当前时间段内，创建一个新的时间段
        if (!currentInterval || currentInterval.timestamp !== Math.floor(timestamp.getTime() / 1000)) {
            //如果当前时间段不为空， 且下一个时间段与当前时间段的间隔超过了设定的时间间隔， 那么插入空的时间段
            while (currentInterval && Math.floor(timestamp.getTime() / 1000) - currentInterval.timestamp > interval * 60) {
                currentInterval = {
                    timestamp: currentInterval.timestamp + interval * 60,
                    open: lastClose,
                    high: lastClose,
                    low: lastClose,
                    close: lastClose,
                };
                ohlcData.push(currentInterval);
            }
            const showTimestamp = Math.floor(timestamp.getTime() / 1000);
            currentInterval = {
                timestamp: showTimestamp,
                open: lastClose, //平滑曲线
                high: (Math.max(lastClose, data.price)).toFixed(20),
                low: (Math.min(lastClose, data.price)).toFixed(20),
                close: data.price, //最新的放后面
            };
            ohlcData.push(currentInterval);
        } else {
            // 如果当前数据点在当前时间段内，更新这个时间段的数据
            currentInterval.high = Math.max(currentInterval.high, data.price);
            currentInterval.low = Math.min(currentInterval.low, data.price);
            currentInterval.close = data.price;
        }

        lastClose = currentInterval.close;
    }
    let currentTime = new Date().getTime();
    console.log("currentTime:",currentTime);
    while (currentInterval.timestamp <= currentTime) {
        currentInterval = {
            timestamp: currentInterval.timestamp + interval * 60,
            open: lastClose,
            high: lastClose,
            low: lastClose,
            close: lastClose,
        };
        ohlcData.push(currentInterval);
    }
    console.log("lastTime:",currentInterval.timestamp);
    //删除ohlcData中的第一条数据
    ohlcData.shift();
    return ohlcData;
}

