import pc from 'picocolors'
export function log(msg: string, color = 'green') {
  console.log(
    pc[color](`[megrez]: ${msg}`),
  )
}
