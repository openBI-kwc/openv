// 删除多余数据
export let removeOverData = (chartData, resData) => {
  // 删除多余的数据
  let last = resData.series.length
  let len = chartData.series.length
  if (len > last) chartData.series.splice(last, len - last)
}