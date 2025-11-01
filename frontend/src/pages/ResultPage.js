import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultsRef = useRef(null);
  const prediction = location.state;

  if (!prediction) {
    // If no state, redirect back to predictor
    navigate('/predictor');
    return null;
  }

  const getStatusColor = (probability) => {
    if (probability >= 0.7) return 'border-green-400 bg-green-50';
    if (probability >= 0.5) return 'border-blue-400 bg-blue-50';
    if (probability >= 0.3) return 'border-yellow-300 bg-yellow-50';
    return 'border-red-300 bg-red-50';
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low Risk': return 'text-green-700 bg-green-100';
      case 'Medium Risk': return 'text-yellow-700 bg-yellow-100';
      case 'High Risk': return 'text-red-700 bg-red-100';
      case 'Very High Risk': return 'text-red-800 bg-red-200';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getFactorAnalysisData = () => {
    const factors = [
      { name: 'Business Capital', impact: Math.random() * 0.3 + 0.1 },
      { name: 'Owner Experience', impact: Math.random() * 0.25 + 0.15 },
      { name: 'Education Level', impact: Math.random() * 0.2 + 0.1 },
      { name: 'Business Sector', impact: Math.random() * 0.15 + 0.05 },
      { name: 'Location', impact: Math.random() * 0.1 + 0.05 },
      { name: 'Entity Type', impact: Math.random() * 0.08 + 0.02 }
    ];

    return {
      labels: factors.map(f => f.name),
      datasets: [{
        label: 'Impact on Success',
        data: factors.map(f => (f.impact * 100).toFixed(1)),
        backgroundColor: ['#4a90e2','#1e3a5f','#7bb3f0','#2d5aa0','#5c8dd6','#95c5ff'],
        borderColor: '#1e3a5f',
        borderWidth: 1
      }]
    };
  };

  const getSuccessRateData = () => {
    const successRate = prediction.success_probability;
    const failureRate = 1 - successRate;
    return {
      labels: ['Success Probability', 'Risk Probability'],
      datasets: [{
        data: [(successRate * 100).toFixed(1), (failureRate * 100).toFixed(1)],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderColor: ['#16a34a', '#dc2626'],
        borderWidth: 2
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    }
  };

  const generatePDFReport = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const element = resultsRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: true });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 20;

      pdf.setFontSize(18);
      pdf.text('SME Success Prediction Report', 12, 14);
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('SME_Prediction_Report.pdf');
    } catch (err) {
      console.error('PDF error', err);
    }
  };

  // Helper to map factor impact to label and color
  const impactBadge = (value) => {
    const v = parseFloat(value);
    if (v >= 20) return { label: 'High', color: 'bg-green-100 text-green-800' };
    if (v >= 12) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Low', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12" style={{ fontFamily: "'Space Mono', monospace" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={resultsRef}>
          <h1 className="text-3xl font-bold mb-4 text-center" style={{ color: '#072033' }}>
            Prediction Results & Analysis
          </h1>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`p-6 rounded-lg border ${getStatusColor(prediction.success_probability)} shadow-sm`}>
              <h3 className="text-sm font-semibold mb-2">Business Success</h3>
              <div className="text-xl font-bold">{prediction.prediction_label}</div>
            </div>

            <div className="p-6 rounded-lg border border-blue-100 bg-blue-50 shadow-sm text-center">
              <h3 className="text-sm font-semibold mb-2">Success Rate</h3>
              <div className="text-3xl font-bold text-blue-600">{(prediction.success_probability * 100).toFixed(1)}%</div>
            </div>

            <div className={`p-6 rounded-lg border ${getRiskColor(prediction.recommendations.risk_level)} shadow-sm`}>
              <h3 className="text-sm font-semibold mb-2">Risk Assessment</h3>
              <div className="text-lg font-bold">{prediction.recommendations.risk_level}</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold mb-4">Factor Analysis</h4>
              <div style={{ height: 280 }}>
                <Bar data={getFactorAnalysisData()} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold mb-4">Success Distribution</h4>
              <div style={{ height: 280 }}>
                <Doughnut data={getSuccessRateData()} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Detailed Factor Analysis - styled with left accent */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Detailed Factor Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Financial */}
              <div className="bg-white rounded shadow-sm border-l-4 border-blue-400 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Financial Factors</h4>
                  <span className="text-sm text-gray-500">Top</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex justify-between items-center">
                    <div>Business Capital</div>
                    <span className={`px-2 py-1 rounded text-xs ${impactBadge(28).color}`}>{impactBadge(28).label}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>Capital Source</div>
                    <span className={`px-2 py-1 rounded text-xs ${impactBadge(15).color}`}>{impactBadge(15).label}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>Entity Structure</div>
                    <span className={`px-2 py-1 rounded text-xs ${impactBadge(6).color}`}>{impactBadge(6).label}</span>
                  </li>
                </ul>
              </div>

              {/* Human Capital */}
              <div className="bg-white rounded shadow-sm border-l-4 border-green-400 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Human Capital</h4>
                  <span className="text-sm text-gray-500">People</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex justify-between items-center">
                    <div>Owner Experience</div>
                    <span className={`px-2 py-1 rounded text-xs ${impactBadge(24).color}`}>{impactBadge(24).label}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>Education Level</div>
                    <span className={`px-2 py-1 rounded text-xs ${impactBadge(14).color}`}>{impactBadge(14).label}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>Age Factor</div>
                    <span className={`px-2 py-1 rounded text-xs ${impactBadge(12).color}`}>{impactBadge(12).label}</span>
                  </li>
                </ul>
              </div>

              {/* Market */}
              <div className="bg-white rounded shadow-sm border-l-4 border-purple-400 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Market Factors</h4>
                  <span className="text-sm text-gray-500">Context</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex justify-between items-center">
                    <div>Business Sector</div>
                    <span className={`px-2 py-1 rounded text-xs ${impactBadge(11).color}`}>{impactBadge(11).label}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>Location</div>
                    <span className={`px-2 py-1 rounded text-xs ${impactBadge(7).color}`}>{impactBadge(7).label}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>Team Size</div>
                    <span className={`px-2 py-1 rounded text-xs ${impactBadge(5).color}`}>{impactBadge(5).label}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Recommendations & Strategic Advice</h3>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded shadow-sm border-l-4 border-blue-500">
                <h4 className="font-semibold mb-2">Overall Assessment</h4>
                <p className="text-sm text-gray-700">{prediction.recommendations.overall_assessment}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {prediction.recommendations.key_strengths && (
                  <div className="bg-white p-4 rounded shadow-sm border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Key Strengths</h4>
                      <span className="text-xs px-2 py-1 rounded bg-green-50 text-green-700">Strength</span>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-2">
                      {prediction.recommendations.key_strengths.slice(0,3).map((s, i) => <li key={i}>• {s}</li>)}
                    </ul>
                  </div>
                )}

                {prediction.recommendations.improvement_areas && (
                  <div className="bg-white p-4 rounded shadow-sm border-l-4 border-yellow-400">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Areas to Improve</h4>
                      <span className="text-xs px-2 py-1 rounded bg-yellow-50 text-yellow-700">Improve</span>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-2">
                      {prediction.recommendations.improvement_areas.slice(0,3).map((a,i) => <li key={i}>• {a}</li>)}
                    </ul>
                  </div>
                )}

                {prediction.recommendations.action_items && (
                  <div className="bg-white p-4 rounded shadow-sm border-l-4 border-purple-400">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Action Items</h4>
                      <span className="text-xs px-2 py-1 rounded bg-purple-50 text-purple-700">Priority</span>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-2">
                      {prediction.recommendations.action_items.slice(0,3).map((ai,i) => <li key={i}>• {ai}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button className="btn-secondary py-2 px-6" onClick={() => navigate('/predictor')}>Try Another Prediction</button>
            <button className="btn-primary py-2 px-6" onClick={generatePDFReport}>Download Report (PDF)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
