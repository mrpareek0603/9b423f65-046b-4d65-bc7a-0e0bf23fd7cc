import { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import './Dashboard.css';

const Dashboard = () => {
  const [start, setStart] = useState('2000-01-01 00:00');
  const [end, setEnd] = useState(getCurrentTimestamp());
  const [chartData, setChartData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [deviceId, setDeviceId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function getCurrentTimestamp() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:3000/api/savings', {
        params: { deviceId: Number(deviceId), start, end },
      });

      setChartData(res.data?.data ?? []);
      setMeta(res.data ?? null);
    } catch (err) {
      setError(
        err.response?.status === 400
          ? JSON.stringify(err.response.data.message)
          : 'Something went wrong while fetching data. Please try again.'
      );
      setChartData([]);
      setMeta(null);
    } finally {
      setIsLoading(false);
    }
  }, [deviceId, start, end]);

  const chartOptions = useMemo(() => {
    const data = chartData ?? [];
    return {
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['Carbon savings', 'Diesel savings'],
        bottom: 0
      },
      xAxis: { type: 'category', data: data.map(d => d.month) },
      yAxis: { type: 'value', name: 'Amount' },
      series: [
        { name: 'Carbon savings', type: 'bar', data: data.map(d => Number(d.carbonSaved?.toFixed?.(2) ?? 0)) },
        { name: 'Diesel savings', type: 'bar', data: data.map(d => Number(d.dieselSaved?.toFixed?.(2) ?? 0)) },
      ],
    };
  }, [chartData]);

  return (
    <main className="content">
      <header className="toast-bar">
        <h1>Estimated Carbon Savings &amp; Diesel Savings</h1>
      </header>

      <section className="dashboard">
        <section aria-labelledby="guidelines-title">
          <h2 id="guidelines-title" className="text">
            Download general guidelines on the estimated carbon and diesel savings calculations
          </h2>
          <hr />
        </section>

        <section>
          <h2>Estimated carbon savings</h2>
          <p className="muted">1 Tonne = 1,000 kg</p>
          <div className="metric-row">
            <div className="metric">
              <div className="metric-title">
                Total <span className="info" title="Sum to date">ⓘ</span>
              </div>
              <div className="metric-value green">{meta ? meta.totalCarbon/1000 : '-'}</div>
              <div className="metric-unit">Tonnes</div>
            </div>
            <div className="metric">
              <div className="metric-title">
                Monthly <span className="info" title="Average per month">ⓘ</span>
              </div>
              <div className="metric-value green">{meta ? meta.monthlyCarbon/1000 : '-'}</div>
              <div className="metric-unit">Tonnes</div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section>
          <h2>Estimated diesel savings</h2>
          <div className="metric-row">
            <div className="metric">
              <div className="metric-title">
                Total <span className="info" title="Sum to date">ⓘ</span>
              </div>
              <div className="metric-value purple">{meta ? meta.totalDiesel : '-'}</div>
              <div className="metric-unit">Litres</div>
            </div>
            <div className="metric">
              <div className="metric-title">
                Monthly <span className="info" title="Average per month">ⓘ</span>
              </div>
              <div className="metric-value purple">{meta ? meta.totalDiesel : '-'}</div>
              <div className="metric-unit">Litres</div>
            </div>
          </div>
        </section>

        <section aria-labelledby="controls-title">
          <h2 id="controls-title" className="sr-only">Filters</h2>
          <form className="controls" onSubmit={(e) => { e.preventDefault(); fetchData(); }}>
            <label>
              Device ID
              <input
                type="number"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="input"
                placeholder="Device ID"
                min="1"
              />
            </label>
            <label>
              Start
              <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className="input" />
            </label>
            <label>
              End
              <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} className="input" />
            </label>
            <button type="submit" className="button" disabled={isLoading}>
              {isLoading ? 'Loading…' : 'Load'}
            </button>
          </form>
        </section>

        {error && <div className="error" role="alert">{error}</div>}

        {chartData.length > 0 && !isLoading ? (
          <figure>
            <ReactECharts option={chartOptions} style={{ height: 400, width: '100%' }} />
          </figure>
        ) : (
          !isLoading && <p className="empty">No data yet. Pick a range and click Load.</p>
        )}


      </section>
    </main>
  );
};

export default Dashboard;
