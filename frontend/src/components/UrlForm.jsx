import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import { createShortUrl } from '../services/api';

const UrlForm = ({ onUrlCreated }) => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    customCode: '',
    tags: [],
    expiryHours: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (formData.tags.length < 5) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        // Only include non-empty optional fields
        customCode: formData.customCode.trim() || undefined,
        expiryHours: formData.expiryHours.trim() ? Number(formData.expiryHours) : undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      };

      const response = await createShortUrl(submitData);
      onUrlCreated(response.data);
      setFormData({
        originalUrl: '',
        customCode: '',
        tags: [],
        expiryHours: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Create Short URL
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            required
            fullWidth
            label="Original URL"
            name="originalUrl"
            value={formData.originalUrl}
            onChange={handleInputChange}
            placeholder="https://example.com"
          />
          <TextField
            fullWidth
            label="Custom Code (optional)"
            name="customCode"
            value={formData.customCode}
            onChange={handleInputChange}
            placeholder="my-custom-code"
            helperText="3-20 characters, letters, numbers, hyphens, and underscores only"
          />
          <TextField
            fullWidth
            label="Expiry Hours (optional)"
            name="expiryHours"
            type="number"
            value={formData.expiryHours}
            onChange={handleInputChange}
            placeholder="24"
            helperText="URL will expire after specified hours (max 8760 hours = 1 year)"
            inputProps={{ min: 1, max: 8760 }}
          />
          <Box>
            <TextField
              fullWidth
              label="Add Tags (optional)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagInputKeyPress}
              helperText="Press Enter to add a tag (max 5 tags)"
            />
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Creating...' : 'Create Short URL'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default UrlForm; 