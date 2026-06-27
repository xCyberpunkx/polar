'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'

interface ReportData {
  generatedAt: string
  stabilityScore: number
  stabilityLabel: string
  totalDaysTracked: number
  last30Days: {
    avgMood: string
    avgSleep: string
    medsAdherence: number
    checkinsCount: number
  }
  episodes: {
    type: string
    startDate: string
    endDate?: string
    severity: number
    trigger?: string | null
    whatHelped?: string | null
  }[]
  medications: { name: string; dosage: string | null; frequency: string | null }[]
  patterns: { title: string; description: string; type: string }[]
  moodHistory: { date: string; mood: number; energy: number; sleep: number; medsTaken: boolean; word: string }[]
}

function buildReportHTML(data: ReportData): string {
  const date = new Date(data.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const moodBars = data.moodHistory.map((d) => `
    <tr>
      <td style="padding:4px 8px;font-size:12px;color:#666;">${d.date}</td>
      <td style="padding:4px 8px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:${d.mood * 18}px;height:8px;background:#6366f1;border-radius:4px;"></div>
          <span style="font-size:12px;color:#333;">${d.mood}/10</span>
        </div>
      </td>
      <td style="padding:4px 8px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:${d.energy * 18}px;height:8px;background:#22c55e;border-radius:4px;"></div>
          <span style="font-size:12px;color:#333;">${d.energy}/10</span>
        </div>
      </td>
      <td style="padding:4px 8px;font-size:12px;color:#666;">${d.sleep}h</td>
      <td style="padding:4px 8px;font-size:12px;color:${d.medsTaken ? '#16a34a' : '#dc2626'};">${d.medsTaken ? '✓' : '✗'}</td>
      <td style="padding:4px 8px;font-size:12px;color:#888;font-style:italic;">${d.word}</td>
    </tr>
  `).join('')

  const episodeRows = data.episodes.map((e) => `
    <tr>
      <td style="padding:6px 8px;font-size:12px;text-transform:capitalize;">${e.type}</td>
      <td style="padding:6px 8px;font-size:12px;">${new Date(e.startDate).toLocaleDateString()}</td>
      <td style="padding:6px 8px;font-size:12px;">${e.endDate ? new Date(e.endDate).toLocaleDateString() : 'Ongoing'}</td>
      <td style="padding:6px 8px;font-size:12px;">${e.severity}/10</td>
      <td style="padding:6px 8px;font-size:12px;color:#666;">${e.trigger || '—'}</td>
      <td style="padding:6px 8px;font-size:12px;color:#666;">${e.whatHelped || '—'}</td>
    </tr>
  `).join('')

  const medsList = data.medications.map((m) => `
    <li style="margin-bottom:4px;font-size:13px;">
      <strong>${m.name}</strong>
      ${m.dosage ? ` — ${m.dosage}` : ''}
      ${m.frequency ? ` (${m.frequency})` : ''}
    </li>
  `).join('')

  const patternsList = data.patterns.map((p) => `
    <div style="margin-bottom:12px;padding:10px 14px;border-left:3px solid ${p.type === 'warning' ? '#f59e0b' : p.type === 'positive' ? '#22c55e' : '#6366f1'};background:#f9f9f9;">
      <div style="font-size:13px;font-weight:600;margin-bottom:4px;">${p.title}</div>
      <div style="font-size:12px;color:#666;">${p.description}</div>
    </div>
  `).join('')

  const scoreColor = data.stabilityScore >= 75 ? '#16a34a' : data.stabilityScore >= 50 ? '#d97706' : '#dc2626'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Polar Report — ${date}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
    h2 { font-size: 14px; font-weight: 600; margin: 28px 0 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #444; border-bottom: 1px solid #eee; padding-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 8px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;">
    <div>
      <h1>Polar — Wellness Report</h1>
      <div style="font-size:13px;color:#888;margin-top:4px;">Generated ${date} · ${data.totalDaysTracked} days tracked</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:36px;font-weight:700;color:${scoreColor};">${data.stabilityScore}</div>
      <div style="font-size:12px;color:#888;">Stability Score · ${data.stabilityLabel}</div>
    </div>
  </div>

  <h2>30-Day Summary</h2>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:8px;">
    <div style="padding:12px;background:#f5f5f5;border-radius:6px;">
      <div style="font-size:11px;color:#888;margin-bottom:4px;">AVG MOOD</div>
      <div style="font-size:22px;font-weight:700;color:#6366f1;">${data.last30Days.avgMood}/10</div>
    </div>
    <div style="padding:12px;background:#f5f5f5;border-radius:6px;">
      <div style="font-size:11px;color:#888;margin-bottom:4px;">AVG SLEEP</div>
      <div style="font-size:22px;font-weight:700;">${data.last30Days.avgSleep}h</div>
    </div>
    <div style="padding:12px;background:#f5f5f5;border-radius:6px;">
      <div style="font-size:11px;color:#888;margin-bottom:4px;">MEDS ADHERENCE</div>
      <div style="font-size:22px;font-weight:700;color:${data.last30Days.medsAdherence >= 80 ? '#16a34a' : '#d97706'};">${data.last30Days.medsAdherence}%</div>
    </div>
    <div style="padding:12px;background:#f5f5f5;border-radius:6px;">
      <div style="font-size:11px;color:#888;margin-bottom:4px;">CHECK-INS</div>
      <div style="font-size:22px;font-weight:700;">${data.last30Days.checkinsCount}</div>
    </div>
  </div>

  ${data.medications.length > 0 ? `
  <h2>Current Medications</h2>
  <ul style="padding-left:16px;">${medsList}</ul>
  ` : ''}

  ${data.patterns.length > 0 ? `
  <h2>Detected Patterns</h2>
  ${patternsList}
  ` : ''}

  ${data.episodes.length > 0 ? `
  <h2>Episode History</h2>
  <table>
    <thead><tr>
      <th>Type</th><th>Start</th><th>End</th><th>Severity</th><th>Trigger</th><th>What Helped</th>
    </tr></thead>
    <tbody>${episodeRows}</tbody>
  </table>
  ` : ''}

  <h2>Daily Log — Last 30 Days</h2>
  <table>
    <thead><tr>
      <th>Date</th><th>Mood</th><th>Energy</th><th>Sleep</th><th>Meds</th><th>Word</th>
    </tr></thead>
    <tbody>${moodBars}</tbody>
  </table>

  <div style="margin-top:40px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#aaa;">
    Generated by Polar · This report is for informational purposes only and does not constitute medical advice.
  </div>
</body>
</html>`
}

export function ReportGenerator({ reportData }: { reportData: ReportData }) {
  const [generating, setGenerating] = useState(false)

  function openReport() {
    setGenerating(true)
    const html = buildReportHTML(reportData)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank')
    setTimeout(() => {
      win?.print()
      setGenerating(false)
    }, 500)
  }

  function downloadReport() {
    const html = buildReportHTML(reportData)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `polar-report-${new Date().toISOString().split('T')[0]}.html`
    a.click()
  }

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button onClick={openReport} disabled={generating} style={{ flex: 1, justifyContent: 'center' }}>
        {generating ? 'Generating...' : '🖨 Print / Save as PDF'}
      </Button>
      <Button variant="secondary" onClick={downloadReport} style={{ flex: 1, justifyContent: 'center' }}>
        ⬇ Download HTML
      </Button>
    </div>
  )
}
