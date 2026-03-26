module.exports = function escapeRegExp(value = '') {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
