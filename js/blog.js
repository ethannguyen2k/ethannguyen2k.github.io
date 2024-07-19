document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '☰';
    toggleButton.classList.add('sidebar-toggle');

    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });

    document.body.insertBefore(toggleButton, sidebar);

    // CSS to handle the collapse
    const style = document.createElement('style');
    style.innerHTML = `
        .sidebar.collapsed {
            width: 60px;
        }
        .container2 {
            margin-left: 80px; /* Adjust based on collapsed width */
        }
        .sidebar-toggle {
            position: fixed;
            top: 20px;
            left: 20px;
            background-color: #0096E2;
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
            z-index: 1000;
        }
        .sidebar.collapsed .header-content,
        .sidebar.collapsed .nav-bar,
        .sidebar.collapsed .sidebar-extra {
            display: none;
        }
        .sidebar.collapsed .sidebar-toggle {
            left: 70px; /* Adjust based on collapsed width */
        }
    `;
    document.head.appendChild(style);
});
