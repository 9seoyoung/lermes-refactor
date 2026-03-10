package com.kdt.KDT_PJT.file.util;

import java.nio.file.Path;
import java.nio.file.Paths;

public final class StoragePaths {
    private StoragePaths() {}

    /** 물리 루트: user.home/LERMES/files */
    public static Path root() {
        String home = System.getProperty("user.home");
        return Paths.get(home, "LERMES", "files").toAbsolutePath().normalize();
    }
}
