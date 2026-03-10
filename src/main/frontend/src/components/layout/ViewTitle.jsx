import menu from '../../json/menu.json'


function ViewTitle() {
  const info = menu.

  return (
  <>
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginBottom: '10px'}}>
        <span>홈</span>
        <span>{info?.parent ? '>' : ' '}</span>
        <span>{info?.parent}</span>
        <span>{info?.parent ?'>' : ' '}</span>
        <span>{info?.parent ? info?.label : ' '}</span>
    </div>
    <h2>{info?.label}</h2>
  </>
  )
}

export default ViewTitle;