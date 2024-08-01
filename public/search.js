document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('search-query').value;
    const filter = document.getElementById('search-filter').value;
    window.location.href = `/admin/gestion?query=${query}&filter=${filter}`;
});
