/**
 * Returns formatted string of current date
 */
function getTimestamp(){
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
}

module.exports.getTimestamp = getTimestamp;