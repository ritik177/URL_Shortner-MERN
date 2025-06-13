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
  Tooltip,
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
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const UrlList = ({ urls }) => {
  const [expandedUrl, setExpandedUrl] = useState(null);
  const [copyTooltip, setCopyTooltip] = useState('');

  const handleCopy = (url, type) => {
    navigator.clipboard.writeText(url);
    setCopyTooltip(`${type} copied!`);
    setTimeout(() => setCopyTooltip(''), 2000);
  };

  const handleShortUrlClick = (shortUrl) => {
    // Open in new tab
    window.open(shortUrl, '_blank');
  };

  const truncateUrl = (url, maxLength = 30) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
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
                    <Typography
                      sx={{ 
                        cursor: 'pointer',
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => handleShortUrlClick(url.shortUrl)}
                    >
                      {url.shortUrl}
                    </Typography>
                    <Tooltip title={copyTooltip || "Copy short URL"}>
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(url.shortUrl, 'Short URL')}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={url.originalUrl}>
                      <Typography noWrap sx={{ maxWidth: 300 }}>
                        {truncateUrl(url.originalUrl)}
                      </Typography>
                    </Tooltip>
                    <Tooltip title={copyTooltip || "Copy original URL"}>
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(url.originalUrl, 'Original URL')}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
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