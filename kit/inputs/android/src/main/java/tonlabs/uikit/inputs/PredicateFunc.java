package tonlabs.uikit.inputs;

public interface PredicateFunc<T> {
    boolean invoke(T element);
}
