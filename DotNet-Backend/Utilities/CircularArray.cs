public class CircularArray<T>
{
    private T[] array;
    private int start;
    private int end;

    public CircularArray(int capacity)
    {
        array = new T[capacity];
        start = 0;
        end = 0;
    }

    public T? Enqueue(T item)
    {
        T? removedItem = default;
        if ((end + 1) % array.Length == start)
        {
            removedItem = array[start];
            start = (start + 1) % array.Length;
        }
        array[end] = item;
        end = (end + 1) % array.Length;
        return removedItem;
    }

    public T Dequeue()
    {
        if (IsEmpty())
        {
            throw new InvalidOperationException("Queue is empty");
        }
        T result = array[start];
        start = (start + 1) % array.Length;
        return result;
    }

    public bool IsEmpty()
    {
        return start == end;
    }

    public T[] ToArray()
    {
        return array;
    }
}