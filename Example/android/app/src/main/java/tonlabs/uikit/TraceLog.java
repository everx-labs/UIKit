package tonlabs.uikit;

import android.util.Log;

public class TraceLog {
    static final String TAG = "RNSTEST";

    public static void log(String payload) {
        Log.d(TAG, payload + " : " + System.currentTimeMillis());
    }
}
