export function selectByPath(topic, path) {
  return editByPath(topic, path, subtopic => subtopic);
}

export function editByPath(topic, path, calculateNewValue) {
  if (!Array.isArray(path) || path.length === 0)
    return calculateNewValue(topic);
  return (
    path.reduce((currentTopic, pathElement) => {
      if (!pathElement) return calculateNewValue(currentTopic);
      if (
        pathElement === currentTopic ||
        pathElement === currentTopic.topicTitle
      )
        return calculateNewValue(currentTopic);
      const subtopic =
        currentTopic?.topicSubtopics &&
        currentTopic.topicSubtopics.find(
          subtopic =>
            subtopic?.topicTitle === pathElement || subtopic === pathElement
        );
      return subtopic && calculateNewValue(subtopic);
    }, topic) || topic
  );
}
