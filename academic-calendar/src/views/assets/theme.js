const root = document.documentElement;
let style = getComputedStyle(root);
let documentBgThemeColor = style.getPropertyValue('--bs-body-bg')
let documentFontColor = style.getPropertyValue('--bs-body-color')

export const theme = {
    common: {
      border: '1px solid #ddd',
      backgroundColor: documentBgThemeColor,
      holiday: { color: '#f54f3d' },
      saturday: { color: '#135de6' },
      dayName: { color: documentFontColor },
      today: { color: documentFontColor },
      gridSelection: {
        backgroundColor: 'rgba(19, 93, 230, 0.1)',
        border: '1px solid #135de6',
      },
    },
    month: {
      dayName: {
        borderLeft: 'none',
        backgroundColor: 'inherit',
      },
      holidayExceptThisMonth: { color: '#f3acac' },
      dayExceptThisMonth: { color: '#bbb' },
      weekend: { backgroundColor: documentBgThemeColor },
      moreView: { boxShadow: 'none', backgroundColor: documentBgThemeColor },
      moreViewTitle: { backgroundColor: "#FFFFFF" },
    },
    week: {
      dayName: {
        borderTop: '1px solid #ddd',
        borderBottom: '1px solid #ddd',
        borderLeft: '1px solid #ddd',
        backgroundColor: 'inherit',
      },
      today: {
        color: '#009688',
        backgroundColor: 'inherit',
      },
      pastDay: { color: '#999' },
      panelResizer: { border: '1px solid #ddd' },
      dayGrid: { borderRight: '1px solid #ddd' },
      dayGridLeft: {
        width: '100px',
        backgroundColor: '',
        borderRight: '1px solid #ddd',
      },
      weekend: { backgroundColor: documentBgThemeColor },
      timeGridLeft: {
        width: '100px',
        backgroundColor: '#fafafa',
        borderRight: '1px solid #ddd',
      },
      timeGridLeftAdditionalTimezone: { backgroundColor: '#fdfdfd' },
      timeGridHourLine: { borderBottom: '1px solid #eee' },
      timeGridHalfHourLine: { borderBottom: '1px dotted #f9f9f9' },
      timeGrid: { borderRight: '1px solid #ddd' },
      nowIndicatorLabel: { color: '#135de6' },
      nowIndicatorPast: { border: '1px solid rgba(19, 93, 230, 0.3)' },
      nowIndicatorBullet: { backgroundColor: '#135de6' },
      nowIndicatorToday: { border: '1px solid #135de6' },
      nowIndicatorFuture: { border: '1px solid #135de6' },
      pastTime: { color: '#999' },
      futureTime: { color: '#333' },
      gridSelection: { color: '#135de6' },
    },
  };