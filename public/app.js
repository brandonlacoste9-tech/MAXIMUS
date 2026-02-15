// MAXIMUS AI Assistant - Dashboard JavaScript

let chatContext = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadHealth();
    loadMetrics();
    loadLeads();
    loadPersonality();
    
    // Set up event listeners
    document.getElementById('refreshBtn').addEventListener('click', refreshAll);
    document.getElementById('addLeadBtn').addEventListener('click', openAddLeadModal);
    document.getElementById('savePersonalityBtn').addEventListener('click', savePersonality);
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Modal
    const modal = document.getElementById('addLeadModal');
    const span = document.getElementsByClassName('close')[0];
    span.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
    
    document.getElementById('addLeadForm').addEventListener('submit', addLead);
    
    // Auto-refresh every 30 seconds
    setInterval(refreshAll, 30000);
});

async function refreshAll() {
    loadHealth();
    loadMetrics();
    loadLeads();
}

// Health Status
async function loadHealth() {
    try {
        const response = await fetch('/api/health');
        const health = await response.json();
        
        // Update API health
        const apiTile = document.getElementById('apiHealth');
        apiTile.querySelector('.tile-value').textContent = health.services.api.status;
        apiTile.querySelector('.tile-icon').textContent = health.services.api.status === 'healthy' ? '🟢' : '🔴';
        
        // Update AI health
        const aiTile = document.getElementById('aiHealth');
        aiTile.querySelector('.tile-value').textContent = health.services.ai.provider + ' - ' + health.services.ai.status;
        aiTile.querySelector('.tile-icon').textContent = health.services.ai.status === 'healthy' ? '🟢' : '🟡';
    } catch (error) {
        console.error('Failed to load health:', error);
    }
}

// Metrics
async function loadMetrics() {
    try {
        const response = await fetch('/api/metrics');
        const metrics = await response.json();
        
        document.getElementById('totalRequests').textContent = metrics.requests;
        document.getElementById('chatMessages').textContent = metrics.chatMessages;
        document.getElementById('leadsCreated').textContent = metrics.leadsCreated;
        document.getElementById('uptime').textContent = formatUptime(metrics.uptimeSeconds);
    } catch (error) {
        console.error('Failed to load metrics:', error);
    }
}

function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
}

// Leads
async function loadLeads() {
    try {
        const response = await fetch('/api/leads');
        const leads = await response.json();
        
        const tbody = document.getElementById('leadsTableBody');
        
        if (leads.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No leads yet. Add your first lead!</td></tr>';
            return;
        }
        
        tbody.innerHTML = leads.map(lead => `
            <tr>
                <td>${lead.name || 'N/A'}</td>
                <td>${lead.email || 'N/A'}</td>
                <td>${lead.source || 'N/A'}</td>
                <td><span class="status-badge status-${lead.status}">${lead.status}</span></td>
                <td>${new Date(lead.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteLead('${lead.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Failed to load leads:', error);
    }
}

function openAddLeadModal() {
    document.getElementById('addLeadModal').style.display = 'block';
}

async function addLead(e) {
    e.preventDefault();
    
    const leadData = {
        name: document.getElementById('leadName').value,
        email: document.getElementById('leadEmail').value,
        phone: document.getElementById('leadPhone').value,
        source: document.getElementById('leadSource').value,
        status: document.getElementById('leadStatus').value
    };
    
    try {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData)
        });
        
        if (response.ok) {
            document.getElementById('addLeadModal').style.display = 'none';
            document.getElementById('addLeadForm').reset();
            loadLeads();
            loadMetrics();
        }
    } catch (error) {
        console.error('Failed to add lead:', error);
        alert('Failed to add lead');
    }
}

async function deleteLead(id) {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    
    try {
        const response = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadLeads();
        }
    } catch (error) {
        console.error('Failed to delete lead:', error);
        alert('Failed to delete lead');
    }
}

// Personality
async function loadPersonality() {
    try {
        const response = await fetch('/api/personality');
        const personality = await response.json();
        
        document.getElementById('personalityEditor').value = personality.raw;
        document.getElementById('previewContent').innerHTML = personality.html;
    } catch (error) {
        console.error('Failed to load personality:', error);
    }
}

async function savePersonality() {
    const content = document.getElementById('personalityEditor').value;
    
    try {
        const response = await fetch('/api/personality', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Personality saved successfully!');
            loadPersonality();
        } else {
            alert('Failed to save personality: ' + result.message);
        }
    } catch (error) {
        console.error('Failed to save personality:', error);
        alert('Failed to save personality');
    }
}

// Chat
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat('user', message);
    input.value = '';
    
    try {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, context: chatContext })
        });
        
        const result = await response.json();
        
        if (result.response) {
            addMessageToChat('assistant', result.response);
            
            // Update context
            chatContext.push({ role: 'user', content: message });
            chatContext.push({ role: 'assistant', content: result.response });
            
            // Keep context limited to last 10 messages
            if (chatContext.length > 10) {
                chatContext = chatContext.slice(-10);
            }
        } else {
            addMessageToChat('assistant', 'Error: ' + (result.error || 'Unknown error'));
        }
        
        loadMetrics();
    } catch (error) {
        console.error('Failed to send message:', error);
        addMessageToChat('assistant', 'Error: Failed to communicate with AI');
    }
}

function addMessageToChat(role, message) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    messageDiv.innerHTML = `<strong>${role === 'user' ? 'You' : 'MAXIMUS'}:</strong> ${message}`;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
