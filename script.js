const people = [
	{ name: 'Maya Chen', initials: 'MC', team: 'Design', time: '08:42 AM', status: 'present', color: 'avatar-1' },
	{ name: 'Ethan Williams', initials: 'EW', team: 'Engineering', time: '08:47 AM', status: 'present', color: 'avatar-2' },
	{ name: 'Sofia Rodriguez', initials: 'SR', team: 'Marketing', time: '09:03 AM', status: 'late', color: 'avatar-3' },
	{ name: 'Noah Patel', initials: 'NP', team: 'Engineering', time: '08:51 AM', status: 'present', color: 'avatar-4' },
	{ name: 'Olivia Brooks', initials: 'OB', team: 'Operations', time: '—', status: 'absent', color: 'avatar-5' },
	{ name: 'Liam Carter', initials: 'LC', team: 'Design', time: '09:11 AM', status: 'late', color: 'avatar-2' },
	{ name: 'Ava Thompson', initials: 'AT', team: 'Marketing', time: '08:38 AM', status: 'present', color: 'avatar-3' },
	{ name: 'James Wilson', initials: 'JW', team: 'Engineering', time: '—', status: 'absent', color: 'avatar-1' }
];

const statusLabels = { present: 'Present', late: 'Late', absent: 'Absent' };
const body = document.querySelector('#attendanceBody');
const searchInput = document.querySelector('#searchInput');
const statusFilter = document.querySelector('#statusFilter');
const shownCount = document.querySelector('#shownCount');
const toast = document.querySelector('#toast');

function renderPeople() {
	const query = searchInput.value.toLowerCase().trim();
	const filter = statusFilter.value;
	const visiblePeople = people.filter((person) => {
		const matchesQuery = `${person.name} ${person.team}`.toLowerCase().includes(query);
		return matchesQuery && (filter === 'all' || person.status === filter);
	});
	shownCount.textContent = visiblePeople.length;
	body.innerHTML = visiblePeople.map((person) => `<tr>
		<td><div class="person-cell"><span class="person-avatar ${person.color}">${person.initials}</span>${person.name}</div></td>
		<td>${person.team}</td><td>${person.time}</td>
		<td><span class="status status-${person.status}">${statusLabels[person.status]}</span></td>
		<td><button class="action-button" aria-label="More actions for ${person.name}">•••</button></td>
	</tr>`).join('') || '<tr><td colspan="5" class="empty-state">No people match this view.</td></tr>';
}

function showToast(message) {
	toast.textContent = message;
	toast.classList.add('show');
	window.setTimeout(() => toast.classList.remove('show'), 2500);
}

searchInput.addEventListener('input', renderPeople);
statusFilter.addEventListener('change', renderPeople);
document.querySelectorAll('.nav-item').forEach((item) => item.addEventListener('click', (event) => {
	if (item.getAttribute('href') !== '#attendance') {
		event.preventDefault();
		showToast(`${item.textContent.trim()} is coming soon.`);
	}
}));

const modalBackdrop = document.querySelector('#modalBackdrop');
document.querySelector('#addPersonButton').addEventListener('click', () => { modalBackdrop.hidden = false; });
document.querySelector('#closeModal').addEventListener('click', () => { modalBackdrop.hidden = true; });
modalBackdrop.addEventListener('click', (event) => { if (event.target === modalBackdrop) modalBackdrop.hidden = true; });
document.querySelector('#personForm').addEventListener('submit', (event) => {
	event.preventDefault();
	const formData = new FormData(event.target);
	const name = formData.get('name').trim();
	const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
	people.unshift({ name, initials, team: formData.get('team'), time: '—', status: 'absent', color: 'avatar-4' });
	modalBackdrop.hidden = true;
	event.target.reset();
	renderPeople();
	showToast(`${name} was added to the workspace.`);
});

renderPeople();
