import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Collapse,
  Grid,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  ContentCopy,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const UrlList = ({ urls }) => {
  const [expandedUrl, setExpandedUrl] = useState(null);

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const renderAnalytics = (analytics) => {
    const deviceData = Object.entries(analytics.deviceTypes).map(([name, value]) => ({
      name,
      value,
    }));

    const timeSeriesData = Object.entries(analytics.visitsByDay).map(([date, count]) => ({
      date,
      visits: count,
    }));

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Device Types
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Visits Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="visits" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Top Referrers
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Source</TableCell>
                  <TableCell align="right">Visits</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analytics.topReferrers.map((referrer) => (
                  <TableRow key={referrer.source}>
                    <TableCell>{referrer.source}</TableCell>
                    <TableCell align="right">{referrer.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Short URL</TableCell>
            <TableCell>Original URL</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Total Visits</TableCell>
            <TableCell>Unique Visitors</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Expires</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {urls.map((url) => (
            <React.Fragment key={url.shortCode}>
              <TableRow>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => setExpandedUrl(expandedUrl === url.shortCode ? null : url.shortCode)}
                  >
                    {expandedUrl === url.shortCode ? (
                      <KeyboardArrowUp />
                    ) : (
                      <KeyboardArrowDown />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {url.shortUrl}
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(url.shortUrl)}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>{url.originalUrl}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {url.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>{url.analytics.totalVisits}</TableCell>
                <TableCell>{url.analytics.uniqueVisitors}</TableCell>
                <TableCell>{formatDate(url.createdAt)}</TableCell>
                <TableCell>
                  {url.expiryDate ? formatDate(url.expiryDate) : 'Never'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                  <Collapse
                    in={expandedUrl === url.shortCode}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box sx={{ margin: 2 }}>
                      {renderAnalytics(url.analytics)}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UrlList; 